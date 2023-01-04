package io.squashql;

import io.squashql.jackson.JacksonUtil;
import io.squashql.query.database.QueryEngine;
import io.squashql.query.database.SparkQueryEngine;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.URISyntaxException;

@SpringBootApplication
public class SandboxApplication {

  public static void main(String[] args) {
    SpringApplication.run(SandboxApplication.class, args);
  }

  @Bean
  public QueryEngine queryEngine() {
    return new SparkQueryEngine(createTestDatastoreWithData());
  }

  @Bean
  public MappingJackson2HttpMessageConverter jackson2HttpMessageConverter() {
    return new MappingJackson2HttpMessageConverter(JacksonUtil.mapper);
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

  public static SparkDatastore createTestDatastoreWithData() {
    SparkDatastore datastore = new SparkDatastore();

    String property = System.getProperty("dataset.path");
    Dataset<Row> dataFrame;
    try {
      String path = property != null ? property : Thread.currentThread().getContextClassLoader().getResource("data/saas.csv").toURI().getPath();
      dataFrame = datastore.spark.read()
              .option("delimiter", ",")
              .option("header", true)
              .option("inferSchema", true)
              .csv(path);
    } catch (URISyntaxException e) {
      throw new RuntimeException(e);
    }

    datastore.spark.conf().set("spark.sql.caseSensitive", String.valueOf(true)); // without it, table names are lowercase.
    dataFrame.createOrReplaceTempView("saas");
    return datastore;
  }
}
