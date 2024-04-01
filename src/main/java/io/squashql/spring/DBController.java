package io.squashql.spring;

import io.squashql.ShowcaseApplication;
import io.squashql.SparkDatastore;
import io.squashql.query.database.QueryEngine;
import io.squashql.store.Datastore;
import io.squashql.store.Store;
import io.squashql.table.Table;
import io.squashql.type.TableTypedField;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class DBController {

  private final QueryEngine<?> engine;
  private final Datastore datastore;

  public DBController(QueryEngine<?> engine) {
    this.engine = engine;
    this.datastore = engine.datastore();
  }

  @PostMapping("gs-load")
  public ResponseEntity<String> createTable(@RequestParam(name = "tablename") String tableName, @RequestParam String id, @RequestParam String gid) {
    Table table = ShowcaseApplication.createTable(engine, tableName, id, gid);
    return ResponseEntity.ok(table.toString());
  }

  @PostMapping("show-tables")
  public ResponseEntity<String> showTables() {
    Table table = ShowcaseApplication.showTables(this.engine);
    return ResponseEntity.ok(table.toString());
  }

  @PostMapping("drop")
  public ResponseEntity<String> dropTable(@RequestParam(name = "tablename") String tableName) {
    ShowcaseApplication.dropTable(this.engine, tableName);
    return ResponseEntity.ok("");
  }

  @PostMapping("tables-info")
  public ResponseEntity<List<TableTypeDto>> tablesInfo() {
    Map<String, Store> storesByName = this.datastore.storeByName();
    List<TableTypeDto> tableTypeDtos = new ArrayList<>();
    for (Map.Entry<String, Store> e : storesByName.entrySet()) {
      tableTypeDtos.add(new TableTypeDto(e.getKey(), e.getValue().fields().stream().map(TableTypedField::name).toList()));
    }
    return ResponseEntity.ok(tableTypeDtos);
  }

  record TableTypeDto(String table, List<String> fields) {
  }

  @PostMapping("/upload")
  public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam String table) throws IOException {
    ShowcaseApplication.loadFile((QueryEngine<SparkDatastore>) engine, table, file.getInputStream());
    return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully: " + file.getOriginalFilename());
  }
}
