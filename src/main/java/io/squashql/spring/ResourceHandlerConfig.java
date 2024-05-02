package io.squashql.spring;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import java.util.List;

/**
 * Custom resource handler for the nextjs files. Urls are http://localhost:8080/tutorial but it should serve
 * http://localhost:8080/tutorial/index.html.
 */
@Configuration
public class ResourceHandlerConfig implements WebMvcConfigurer {

  static class IndexFallbackResourceResolver extends PathResourceResolver {
    @Override
    protected Resource resolveResourceInternal(HttpServletRequest request, String requestPath,
                                               List<? extends Resource> locations,
                                               ResourceResolverChain chain) {
      Resource resource = super.resolveResourceInternal(request, requestPath, locations, chain);
      if (resource == null) {
        //try with /index.html
        resource = super.resolveResourceInternal(request, requestPath + "/index.html", locations, chain);
      }
      return resource;
    }
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry
            .setOrder(Ordered.LOWEST_PRECEDENCE)
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            // first time resolved, that route will always be used from cache
            .resourceChain(true)
            .addResolver(new IndexFallbackResourceResolver());
  }
}
