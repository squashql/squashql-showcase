interface CardProps {
  tables: string[],
  features: string[],
  link: string,
}

function Card(props: CardProps) {
  return (
          <div className="card mb-1" style={{width: "30rem"}}>
            <div className="card-body">
              <h5 className="card-title text-muted">Features</h5>
              <p className="card-text">
                {props.features.join(", ")}<br/>
              </p>
              <p className="card-text">
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
            <Card link={"tutorial"} tables={["budget"]}
                  features={["Time-series comparison", "Multiple bucketing", "conditional aggregation"]}/>
            <Card link={"spending"} tables={["spending"]}
                  features={["Time-series comparison", "group comparison", "hierarchical measures"]}/>
            <Card link={"portfolio"} tables={["portfolio"]}
                  features={["VaR 95", "Incremental VaR 95"]}/>
            <Card link={"spendingandpopulation"} tables={["spending", "population"]}
                  features={["Drilling across", "basic measures"]}/>
            <Card link={"financialplanning"} tables={["forecast"]}
                  features={["Time-series comparison", "conditional aggregation", "hierarchical measures"]}/>
            <Card link={"blank"} tables={["blank"]} features={["Load your own csv file and create your own calculations"]}/>
          </div>
  )
}
