package io.squashql;

import org.springframework.boot.SpringApplication;

public class WrapperApplication {
  public static void main(String[] args) {
    System.out.println("in wrapper app");
//        SpringApplication.run(ShowcaseApplication.class);
    SpringApplication app = new SpringApplication(ShowcaseApplication.class);
    app.setMainApplicationClass(ShowcaseApplication.class);
    app.run(args);
  }
}
