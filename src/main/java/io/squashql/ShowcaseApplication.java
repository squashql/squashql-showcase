package io.squashql;

import io.squashql.query.QueryExecutor;
import io.squashql.query.database.DuckDBQueryEngine;
import io.squashql.query.database.QueryEngine;
import io.squashql.table.Table;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.Statement;

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
  public QueryEngine<DuckDBDatastore> queryEngine() {
    QueryEngine<DuckDBDatastore> engine = new DuckDBQueryEngine(new DuckDBDatastore(false));
    configure(engine);
    return engine;
  }

  @Bean
  public ViewResolver viewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
//    resolver.setPrefix("/WEB-INF/views/");
    resolver.setSuffix(".html");
    resolver.setExposeContextBeansAsAttributes(true);
    return resolver;
  }

  private static void configure(QueryEngine<DuckDBDatastore> engine) {
    loadPersonalBudget(engine);
    loadFile(engine, "forecast", "forecast.csv");
    loadFile(engine, "portfolio", "portfolio.csv");
    loadFile(engine, "spending", "spending.csv");
    loadFile(engine, "population", "population.csv");
    System.out.println("Available tables:");
    showTables(engine).show();
  }

  public static Table createTable(QueryEngine<?> engine, String tableName, String id, String gid) {
    engine.executeRawSql(String.format("CREATE OR REPLACE TABLE %s AS SELECT * FROM read_gsheet('%s', %s);", tableName, id, gid));
    return engine.executeRawSql(String.format("DESCRIBE %s;", tableName));
  }

  public static void dropTable(QueryEngine<?> engine, String tableName) {
    ((DuckDBQueryEngine) engine).executeSql(String.format("DROP TABLE %s;", tableName));
  }

  public static Table showTables(QueryEngine<?> engine) {
    return engine.executeRawSql("SHOW TABLES;");
  }

  private static void loadPersonalBudget(QueryEngine<DuckDBDatastore> engine) {
    String fileName = "personal_budget.csv";
    try {
      InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
      Path tempPath = Files.createTempFile("personal_budget_tmp_" + System.currentTimeMillis(), ".csv");
      Files.copy(in, tempPath, StandardCopyOption.REPLACE_EXISTING); // copy the file in tmp dir. otherwise, issue can happen in docker container (file system does not exist)
      Statement statement = ((DuckDBQueryEngine) engine).datastore.getConnection().createStatement();
      statement.execute("CREATE TABLE budget_temp AS SELECT * FROM read_csv_auto('" + tempPath + "');");

      // Print info on the table
      engine.executeRawSql("DESCRIBE budget_temp;").show();

      // Unnest -> one line per scenario
      statement.execute("CREATE TABLE budget AS select * replace (unnest(string_split(Scenarios, ',')) as Scenarios) from budget_temp");
      statement.execute("ALTER TABLE budget RENAME Scenarios to Scenario");

      dropTable(engine, "budget_temp");
      QueryExecutor queryExecutor = new QueryExecutor(engine);
      queryExecutor.executeRaw("select * from budget").show(20);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private static void loadFile(QueryEngine<DuckDBDatastore> engine, String table, String fileName) {
    InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
    loadFile(engine, table, in);
  }

  public static void loadFile(QueryEngine<?> engine, String table, InputStream in) {
    try {
      Path tempPath = Files.createTempFile(table + "_tmp_" + System.currentTimeMillis(), ".csv");
      Files.copy(in, tempPath, StandardCopyOption.REPLACE_EXISTING); // copy the file in tmp dir. otherwise, issue can happen in docker container (file system does not exist)
      Statement statement = ((DuckDBQueryEngine) engine).datastore.getConnection().createStatement();
      statement.execute("CREATE OR REPLACE TABLE " + table + " AS SELECT * FROM read_csv_auto('" + tempPath + "');");

      // Print info on the table
      engine.executeRawSql("DESCRIBE " + table + ";").show();
      engine.executeRawSql("select * from " + table).show(20);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
