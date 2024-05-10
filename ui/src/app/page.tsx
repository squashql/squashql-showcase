import React from "react"

interface CardProps {
  tables: string[],
  features: string[],
  link: string,
}

function Card(props: CardProps) {
  return (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted">Features</h5>
              <p className="card-text">
                {props.features.join(", ")}<br/>
              </p>
              <a href={props.link} className="card-link">Play</a>
            </div>
            <div className="card-footer text-body-secondary">
              <p className="card-text">
                Table(s): {props.tables.map(name => (
                      <a key={name} href={`table?name=${name}`} className="link-secondary m-1">{name}</a>)
              )}
              </p>
            </div>

          </div>
  )
}

export default function Page() {

  return (
          <>
            <div className="row m-1">
              <h2>
                <a className="link-dark me-1" href={"https://github.com/squashql/squashql-showcase"}>
                  <i className="bi bi-github"></i>
                </a>
                SquashQL
                <small className="text-body-secondary">&nbsp;showcase</small>
              </h2>
            </div>
            <div className="row m-1">
              <div className="col">
                <Card link={"tutorial"} tables={["budget"]}
                      features={["Time-series comparison", "Multiple bucketing", "conditional aggregation"]}/>
              </div>
              <div className="col">
                <Card link={"spending"} tables={["spending"]}
                      features={["Time-series comparison", "group comparison", "hierarchical measures"]}/>
              </div>
              <div className="col">
                <Card link={"financialplanning"} tables={["forecast"]}
                      features={["Time-series comparison", "conditional aggregation", "hierarchical measures"]}/>
              </div>
            </div>
            <div className="row m-1">
              <div className="col">
                <Card link={"spendingandpopulation"} tables={["spending", "population"]}
                      features={["Drilling across", "basic measures"]}/>
              </div>
              <div className="col">
                <Card link={"portfolio"} tables={["portfolio"]}
                      features={["VaR 95", "Incremental VaR 95", "Overall incremental VaR 95"]}/>
              </div>
              <div className="col">
                <Card link={"blank"} tables={["blank"]}
                      features={["Load your own csv file and create your calculations"]}/>
              </div>
            </div>
            <div className="row m-1">
              <div className="col">
                <Card link={"duckdb"} tables={["continents", "countries", "cities"]}
                      features={["partial rollup", "grouping sets"]}/>
              </div>
              <div className="col"></div>
              <div className="col"></div>
            </div>
          </>
  )
}
