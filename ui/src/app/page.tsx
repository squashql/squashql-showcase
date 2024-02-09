interface CardProps {
  tables: string[],
  features: string[],
  link: string,
}

function Card(props: CardProps) {
  return (
          <div className="card mb-1" style={{width: "28rem"}}>
            <div className="card-body">
              <h5 className="card-title text-muted">Features</h5>
              <p className="card-text">
                {props.features.join(", ")}<br/>
                Table(s): {props.tables.join(", ")}
              </p>
              <a href={props.link} className="card-link">Play</a>
            </div>
          </div>
  )
}

export default function Page() {

  return (
          <div className="ms-1 mt-1">
            <Card link={"portfolio"} tables={["portfolio"]}
                  features={["Group comparison", "basic measures"]}/>
            <Card link={"spending"} tables={["spending"]}
                  features={["Time-series comparison", "hierarchical measures"]}/>
            <Card link={"spendingandpopulation"} tables={["spending", "portfolio"]}
                  features={["Drilling across", "basic aggregation"]}/>
          </div>
  )
}
