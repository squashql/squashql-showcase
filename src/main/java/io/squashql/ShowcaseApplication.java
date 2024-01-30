package io.squashql;

import io.squashql.query.database.DuckDBQueryEngine;
import io.squashql.query.database.QueryEngine;
import io.squashql.table.Table;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class ShowcaseApplication {

  public static void main(String[] args) {
    SpringApplication.run(ShowcaseApplication.class, args);
  }

  @Bean
  public DuckDBQueryEngine queryEngine() {
    return new DuckDBQueryEngine(createTestDatastoreWithData());
  }

  @Bean
  public DuckDBDatastore createTestDatastoreWithData() {
    DuckDBDatastore datastore = new DuckDBDatastore();
    DuckDBQueryEngine engine = new DuckDBQueryEngine(datastore);
    engine.executeSql("""
            CREATE OR REPLACE MACRO read_gsheet(id, gid) AS
                TABLE FROM read_csv_auto(
                        'https://docs.google.com/spreadsheets/export?format=csv&id=' ||
                        id ||
                        '&gid=' ||
                        gid
                    );
            """);

//    createTable(engine, "myTable", "17QFM8B9E0vRPb6v9Ct2zPKobFWWHia53Odfu1LChAY0", "446626508").show();
//    createTable(engine, "portfolios", "17QFM8B9E0vRPb6v9Ct2zPKobFWWHia53Odfu1LChAY0", "446626508").show();
//    showTables(engine).show();
//    dropTable(engine, "portfolios");
//    showTables(engine).show();
    return datastore;
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

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
      }
    };
  }

//  public static DuckDBDatastore createTestDatastoreWithData() {
//    DuckDBDatastore datastore = new DuckDBDatastore();
//
//    try {
//      String fileName = "personal_budget.csv";
//      String path = Paths.get(Thread.currentThread().getContextClassLoader().getResource(fileName).toURI()).toString();
//      Statement statement = datastore.getConnection().createStatement();
//      statement.execute("CREATE TABLE budget_temp AS SELECT * FROM read_csv_auto('" + path + "');");
//
//      // Print info on the table
//      ResultSet resultSet = statement.executeQuery("DESCRIBE budget_temp;");
//      JdbcUtil.toTable(resultSet).show();
//
//      // Unnest -> one line per scenario
//      statement.execute("CREATE TABLE budget AS select * replace (unnest(string_split(Scenarios, ',')) as Scenarios) from budget_temp");
//      statement.execute("ALTER TABLE budget RENAME Scenarios to Scenario");
//      QueryExecutor queryExecutor = new QueryExecutor(new DuckDBQueryEngine(datastore));
//      queryExecutor.executeRaw("select * from budget").show(100);
//    } catch (Exception e) {
//      throw new RuntimeException(e);
//    }
//    return datastore;
//  }
}
