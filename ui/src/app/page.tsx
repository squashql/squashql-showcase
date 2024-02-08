export default function Page() {

  return (
          <div className="ms-1">
            <h5>Use cases</h5>
            {["portfolio", "spending and population", "spending"].map(page =>
                    <div key={page}>
                      <a className="icon-link icon-link-hover" href={page.replace(/\s/g, "")}>
                        {page}
                        <svg className="bi" aria-hidden="true">
                          <use xlinkHref="#arrow-right"></use>
                        </svg>
                      </a>
                    </div>
            )}
          </div>
  )
}
