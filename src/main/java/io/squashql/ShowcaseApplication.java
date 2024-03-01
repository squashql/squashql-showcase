package io.squashql;

import io.squashql.query.QueryExecutor;
import io.squashql.query.database.QueryEngine;
import io.squashql.query.database.SparkQueryEngine;
import io.squashql.table.Table;
import org.apache.spark.sql.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

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
  public QueryEngine<SparkDatastore> queryEngine() {
    QueryEngine<SparkDatastore> engine = new SparkQueryEngine(new SparkDatastore());
    configure(engine);
    return engine;
  }

  private static void configure(QueryEngine<SparkDatastore> engine) {
    loadPersonalBudget(engine);
    loadFile(engine, "forecast", "business_planning_with_3_months.csv");
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

  public static Table dropTable(QueryEngine<?> engine, String tableName) {
    return engine.executeRawSql(String.format("DROP TABLE %s;", tableName));
  }

  public static Table showTables(QueryEngine<?> engine) {
    return engine.executeRawSql("SHOW TABLES;");
  }

  private static void loadPersonalBudget(QueryEngine<SparkDatastore> engine) {
    String fileName = "personal_budget.csv";
    try {
      InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
      Path tempPath = Files.createTempFile("personal_budget_tmp_" + System.currentTimeMillis(), ".csv");
      Files.copy(in, tempPath, StandardCopyOption.REPLACE_EXISTING); // copy the file in tmp dir. otherwise, issue can happen in docker container (file system does not exist)
      Dataset<Row> dataFrame = loadCsv(engine, "budget_temp", tempPath.toString(), ",", true);

      // Print info on the table
      engine.executeRawSql("DESCRIBE budget_temp;").show();

      // Unnest -> one line per scenario
      Column withoutQuotes = functions.regexp_replace(dataFrame.col("Scenarios"), "\"", "");
      Column scenarios = functions.split(withoutQuotes, ",");
      dataFrame = dataFrame
              .withColumn("Scenario", functions.explode(scenarios))
              .drop("Scenarios");
      SparkSession spark = engine.datastore().spark;
      spark.conf().set("spark.sql.caseSensitive", String.valueOf(true)); // without it, table names are lowercase.
      dataFrame.createOrReplaceTempView("budget");

      dropTable(engine, "budget_temp");
      QueryExecutor queryExecutor = new QueryExecutor(engine);
      queryExecutor.executeRaw("select * from budget").show(20);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private static void loadFile(QueryEngine<SparkDatastore> engine, String table, String fileName) {
    InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
    loadFile(engine, table, in);
  }

  public static void loadFile(QueryEngine<SparkDatastore> engine, String table, InputStream in) {
    try {
      Path tempPath = Files.createTempFile(table + "_tmp_" + System.currentTimeMillis(), ".csv");
      Files.copy(in, tempPath, StandardCopyOption.REPLACE_EXISTING); // copy the file in tmp dir. otherwise, issue can happen in docker container (file system does not exist)
      loadCsv(engine, table, tempPath.toString(), ",", true);

      // Print info on the table
      engine.executeRawSql("DESCRIBE " + table + ";").show();
      engine.executeRawSql("select * from " + table).show(20);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private static Dataset<Row> loadCsv(QueryEngine<SparkDatastore> engine, String tableName, String path, String delimiter, boolean header) {
    SparkSession spark = engine.datastore().spark;
    Dataset<Row> dataFrame = spark.read()
            .option("delimiter", delimiter)
            .option("header", header)
            .option("inferSchema", true)
            .csv(path);
    spark.conf().set("spark.sql.caseSensitive", String.valueOf(true)); // without it, table names are lowercase.
    dataFrame.createOrReplaceTempView(tableName);
    return dataFrame;
  }
}
