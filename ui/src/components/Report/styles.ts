import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    padding: 30,
  },
  title: {
    fontSize: 14,
    backgroundColor: "#E4E4E4",
    padding: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: "#F2F2F2",
  },
  column: {
    flex: 1,
    border: "1px solid #E4E4E4",
    padding: 5,
  },
});

export default styles;
