package io.squashql;

import io.squashql.jdbc.JdbcUtil;
import io.squashql.query.QueryExecutor;
import io.squashql.query.database.DuckDBQueryEngine;
import io.squashql.table.Table;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.*;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class ShowcaseApplication {

  public static void main(String[] args) {
    SpringApplication.run(ShowcaseApplication.class, args);
  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
      }
    };
  }

  @Bean
  public DuckDBQueryEngine queryEngine() {
    DuckDBQueryEngine engine = new DuckDBQueryEngine(new DuckDBDatastore(false));
    configure(engine);
    return engine;
  }

  private static void configure(DuckDBQueryEngine engine) {
    engine.executeSql("""
            CREATE OR REPLACE MACRO read_gsheet(id, gid) AS
                TABLE FROM read_csv_auto(
                        'https://docs.google.com/spreadsheets/export?format=csv&id=' ||
                        id ||
                        '&gid=' ||
                        gid
                    );
            """);

    loadPersonalBudget(engine);
    System.out.println("Available tables:");
    showTables(engine).show();
  }

  public static Table createTable(DuckDBQueryEngine engine, String tableName, String id, String gid) {
    engine.executeSql(String.format("CREATE OR REPLACE TABLE %s AS SELECT * FROM read_gsheet('%s', %s);", tableName, id, gid));
    return engine.executeRawSql(String.format("DESCRIBE %s;", tableName));
  }

  public static boolean dropTable(DuckDBQueryEngine engine, String tableName) {
    return engine.executeSql(String.format("DROP TABLE %s;", tableName));
  }

  public static Table showTables(DuckDBQueryEngine engine) {
    return engine.executeRawSql("SHOW TABLES;");
  }

  private static void loadPersonalBudget(DuckDBQueryEngine engine) {
    String fileName = "personal_budget.csv";
    Path tempPath = null;
    try {
      InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
      tempPath = Files.createTempFile("personal_budget_tmp_" + System.currentTimeMillis(), ".csv");
      Files.copy(in, tempPath, StandardCopyOption.REPLACE_EXISTING); // copy the file in tmp dir. otherwise, issue can happen in docker container (file system does not exist)
      Statement statement = engine.datastore.getConnection().createStatement();
      statement.execute("CREATE TABLE budget_temp AS SELECT * FROM read_csv_auto('" + tempPath + "');");

      // Print info on the table
      ResultSet resultSet = statement.executeQuery("DESCRIBE budget_temp;");
      JdbcUtil.toTable(resultSet).show();

      // Unnest -> one line per scenario
      statement.execute("CREATE TABLE budget AS select * replace (unnest(string_split(Scenarios, ',')) as Scenarios) from budget_temp");
      statement.execute("ALTER TABLE budget RENAME Scenarios to Scenario");
      dropTable(engine, "budget_temp");
      QueryExecutor queryExecutor = new QueryExecutor(engine);
      queryExecutor.executeRaw("select * from budget").show(20);
    } catch (Exception e) {
      throw new RuntimeException(e);
    } finally {
      if (tempPath != null) {
        try {
          Files.delete(tempPath);
        } catch (IOException e) {
          throw new RuntimeException(e);
        }
      }
    }
  }
}
