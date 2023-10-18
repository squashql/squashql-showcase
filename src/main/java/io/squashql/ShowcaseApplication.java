package io.squashql;

import io.squashql.jdbc.JdbcUtil;
import io.squashql.query.QueryExecutor;
import io.squashql.query.database.DuckDBQueryEngine;
import io.squashql.query.database.QueryEngine;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.Statement;

@SpringBootApplication
public class ShowcaseApplication {

  public static void main(String[] args) {
    SpringApplication.run(ShowcaseApplication.class, args);
  }

  @Bean
  public QueryEngine<?> queryEngine() {
    return new DuckDBQueryEngine(createTestDatastoreWithData());
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

  public static DuckDBDatastore createTestDatastoreWithData() {
    DuckDBDatastore datastore = new DuckDBDatastore();

    try {
      String fileName = "personal_budget.csv";
      String path = Paths.get(Thread.currentThread().getContextClassLoader().getResource(fileName).toURI()).toString();
      Statement statement = datastore.getConnection().createStatement();
      statement.execute("CREATE TABLE budget_temp AS SELECT * FROM read_csv_auto('" + path + "');");

      // Print info on the table
      ResultSet resultSet = statement.executeQuery("DESCRIBE budget_temp;");
      JdbcUtil.toTable(resultSet).show();

      // Unnest -> one line per scenario
      statement.execute("CREATE TABLE budget AS select * replace (unnest(string_split(Scenarios, ',')) as Scenarios) from budget_temp");
      statement.execute("ALTER TABLE budget RENAME Scenarios to Scenario");
      QueryExecutor queryExecutor = new QueryExecutor(new DuckDBQueryEngine(datastore));
      queryExecutor.execute("select * from budget").show(100);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
    return datastore;
  }
}
