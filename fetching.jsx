function App() {
  const { Fragment, useState } = React;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://hn.algolia.com/api/v1/search?query=Pasta",
    { hits: [] }
  );

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  let page = data.hits;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
  }

  return (
    <Fragment>
      {isError && <div style={{ color: 'red' }}>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {page.map(item => (
            <li key={item.objectID} style={{ marginBottom: '10px' }}>
              <a href={item.url} style={{ textDecoration: 'none', color: 'blue' }}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        items={data.hits}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </Fragment>
  );
}

// Additional styles for Pagination component
const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map(page => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item" style={{ margin: '5px' }}>
        {page}
      </Button>
    );
  });
  return (
    <nav style={{ marginTop: '20px' }}>
      <ul className="pagination" style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
        {list}
      </ul>
    </nav>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
