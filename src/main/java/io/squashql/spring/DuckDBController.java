package io.squashql.spring;

import com.google.common.collect.ImmutableList;
import io.squashql.DuckDBDatastore;
import io.squashql.ShowcaseApplication;
import io.squashql.query.Header;
import io.squashql.query.database.DuckDBQueryEngine;
import io.squashql.query.database.SqlUtils;
import io.squashql.query.dto.*;
import io.squashql.store.Store;
import io.squashql.table.Table;
import io.squashql.table.TableUtils;
import io.squashql.type.TableTypedField;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class DuckDBController {

  private final DuckDBQueryEngine engine;
  private final DuckDBDatastore datastore;

  public DuckDBController(DuckDBQueryEngine engine, DuckDBDatastore datastore) {
    this.engine = engine;
    this.datastore = datastore;
  }

  @PostMapping("gs-load")
  public ResponseEntity<String> createTable(@RequestParam(name = "tablename") String tableName, @RequestParam String id, @RequestParam String gid) {
    Table table = ShowcaseApplication.createTable(engine, tableName, id, gid);
    return ResponseEntity.ok(table.toString());
  }

  @PostMapping("show-tables")
  public ResponseEntity<String> showTables() {
    Table table = ShowcaseApplication.showTables(engine);
    return ResponseEntity.ok(table.toString());
  }

  @PostMapping("drop")
  public ResponseEntity<String> dropTable(@RequestParam(name = "tablename") String tableName) {
    ShowcaseApplication.dropTable(engine, tableName);
    return ResponseEntity.ok("");
  }

  @PostMapping("tables-info")
  public ResponseEntity<List<TableTypeDto>> tablesInfo() {
    Map<String, Store> storesByName = datastore.fetchStoresByName();
    List<TableTypeDto> tableTypeDtos = new ArrayList<>();
    for (Map.Entry<String, Store> e : storesByName.entrySet()) {
      tableTypeDtos.add(new TableTypeDto(e.getKey(), e.getValue().fields().stream().map(TableTypedField::name).toList()));
    }
    return ResponseEntity.ok(tableTypeDtos);
  }

  record TableTypeDto(String table, List<String> fields) {
  }
}
