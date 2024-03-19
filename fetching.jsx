const { useState, useEffect, useReducer, Fragment } = React;
const axios = require('axios');

// Pagination component and utility functions
const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map(page => (
    <Button key={page} onClick={onPageChange} className="page-item" style={{ margin: '5px' }}>
      {page}
    </Button>
  ));
  return (
    <nav style={{ marginTop: '20px' }}>
      <ul className="pagination" style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
        {list}
      </ul>
    </nav>
  );
};

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);

const paginate = (items, pageNumber, pageSize) => {
  const start = (pageNumber - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

// Data fetching hook
const useDataApi = (initialUrl, initialData) => {
  const [url] = useState(initialUrl); // URL is now constant based on your requirement
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

// App component
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [{ data, isLoading, isError }] = useDataApi(
    "https://hn.algolia.com/api/v1/search?query=Pasta",
    { hits: [] }
  );

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  let page = data.hits;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
  }

  return (
    <Fragment>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="pageSize">Items per page:</label>
        <input
          id="pageSize"
          type="number"
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{ marginLeft: '10px' }}
          placeholder="Enter number of items per page"
        />
      </div>

      {isError && <div style={{ color: 'red' }}>Something went wrong ...</div>}
      {isLoading ? <div>Loading ...</div> : (
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

ReactDOM.render(<App />, document.getElementById('root'));
