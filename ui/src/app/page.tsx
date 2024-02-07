export default function Page() {

  return (
          <div className="ms-1">
            {["portfolio", "spending"].map(page =>
                    <div>
                      <a className="icon-link icon-link-hover" href={page}>
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
