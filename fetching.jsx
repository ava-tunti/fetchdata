const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;

  if (items.length <= 1) {
    return null;
  }

  let num = <input
        type="number"
        value={pageSize}
        onChange={handlePageSizeChange}
        placeholder="Enter number of links per page"
        id="num"
      />; // Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map((page) => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((_, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("Pasta");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Added state for page size
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://hn.algolia.com/api/v1/search?query=Pasta",
    {
      hits: [],
    }
  );

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  // Handler for input change to set page size
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  let page = data.hits;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }

  return (
    <Fragment>
      {/* Input field for page size with placeholder */}
      

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div className="list-group">
          <ul>
            {page.map((item) => (
              <li key={item.objectID}>
                <a
                  href={item.url}
                  className="list-group-item list-group-item-action"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Pagination
        items={data.hits}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));

// not working
// const Pagination = ({ items, pageSize, onPageChange }) => {
//   const { Button } = ReactBootstrap;
  
//   if (items <= 1) {
//     return null;
//   }
  
//   let num = Math.ceil(items.length / pageSize);
//   let pages = range(1, num + 1);
//   const list = pages.map(page => {
//     return (
//       <Button key={page} onClick={onPageChange} className="page-item">
//         {page}
//       </Button>
//     );
//   });
//   return (
//     <nav>
//       <ul className="pagination">{list}</ul>
//     </nav>
//   );
// };


// const range = (start, end) => {
//   return Array(end - start + 1)
//     .fill(0)
//     .map((item, i) => start + i);
// };

// function paginate(items, pageNumber, pageSize) {
//   const start = (pageNumber - 1) * pageSize;
//   let page = items.slice(start, start + pageSize);
//   return page;
// }

// const useDataApi = (initialUrl, initialData) => {
//   const { useState, useEffect, useReducer } = React;
//   const [url, setUrl] = useState(initialUrl);

//   const [state, dispatch] = useReducer(dataFetchReducer, {
//     isLoading: false,
//     isError: false,
//     data: initialData,
//   });

//   useEffect(() => {
//     let didCancel = false;
//     const fetchData = async () => {
//       // Part 1, step 1 code goes here
//       dispatch({ type: "FETCH_INIT" });
//       try {
//         const result = await axios(url);
//         if (!didCancel) {
//           dispatch({ type: "FETCH_SUCCESS", payload: result.data });
//         }
//       } catch (error) {
//         if (!didCancel) {
//           dispatch({ type: "FETCH_FAILURE" });
//         }
//       }
//     };
//     fetchData();
//     return () => {
//       didCancel = true;
//     };
//   }, [url]);
//   return [state, setUrl];
// };

// const dataFetchReducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_INIT':
//       return {
//         ...state,
//         isLoading: true,
//         isError: false,
//       };
//     case 'FETCH_SUCCESS':
//       return {
//         ...state,
//         isLoading: false,
//         isError: false,
//         data: action.payload,
//       };
//     case 'FETCH_FAILURE':
//       return {
//         ...state,
//         isLoading: false,
//         isError: true,
//       };
//     default:
//       throw new Error();
//   }
// };


// function App() {
//   const { Fragment, useState, useEffect, useReducer } = React;
//   const [query, setQuery] = useState('Pasta');
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;
//   const [{ data, isLoading, isError }, doFetch] = useDataApi(
//     'https://hn.algolia.com/api/v1/search?query=Pasta',
//     {
//       hits: [],
//     }
//   );
//   const handlePageChange = (e) => {
//     setCurrentPage(Number(e.target.textContent));
//   };
//   let page = data.hits;
//   if (page.length >= 1) {
//     page = paginate(page, currentPage, pageSize);
//     console.log(`currentPage: ${currentPage}`);
//   }
//   return (
//     <Fragment>
//       {isLoading ? (
//         <div>Loading ...</div>
//       ) : (
//         // Part 1, step 2 code goes here
//         <div className="list-group">
//           <ul>
//             {page.map((item) => (
//               <li key={item.objectID}>
//                 <a href={item.url} className="list-group-item list-group-item-action">{item.title}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <Pagination
//         items={data.hits}
//         pageSize={pageSize}
//         onPageChange={handlePageChange}
//       ></Pagination>
//     </Fragment>
//   );
// }

// // ========================================
// ReactDOM.render(<App />, document.getElementById('root'));


//working one
// const Pagination = ({ items, pageSize, onPageChange }) => {
//   const { Button } = ReactBootstrap;

//   if (items.length <= 1) {
//     return null;
//   }

//   let num = Math.ceil(items.length / pageSize);
//   let pages = range(1, num + 1);
//   const list = pages.map((page) => {
//     return (
//       <Button key={page} onClick={onPageChange} className="page-item">
//         {page}
//       </Button>
//     );
//   });
//   return (
//     <nav>
//       <ul className="pagination">{list}</ul>
//     </nav>
//   );
// };

// const range = (start, end) => {
//   return Array(end - start + 1)
//     .fill(0)
//     .map((_, i) => start + i);
// };

// function paginate(items, pageNumber, pageSize) {
//   const start = (pageNumber - 1) * pageSize;
//   let page = items.slice(start, start + pageSize);
//   return page;
// }

// function App() {
//   const { Fragment, useState, useEffect, useReducer } = React;
//   const [query, setQuery] = useState("Pasta");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10); // Added state for page size
//   const [{ data, isLoading, isError }, doFetch] = useDataApi(
//     "https://hn.algolia.com/api/v1/search?query=Pasta",
//     {
//       hits: [],
//     }
//   );

//   const handlePageChange = (e) => {
//     setCurrentPage(Number(e.target.textContent));
//   };

//   // Handler for input change to set page size
//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page when page size changes
//   };

//   let page = data.hits;
//   if (page.length >= 1) {
//     page = paginate(page, currentPage, pageSize);
//     console.log(`currentPage: ${currentPage}`);
//   }

//   return (
//     <Fragment>
//       {/* Input field for page size with placeholder */}
//       <input
//         type="number"
//         value={pageSize}
//         onChange={handlePageSizeChange}
//         placeholder="Enter number of links per page"
//       />

//       {isLoading ? (
//         <div>Loading ...</div>
//       ) : (
//         <div className="list-group">
//           <ul>
//             {page.map((item) => (
//               <li key={item.objectID}>
//                 <a
//                   href={item.url}
//                   className="list-group-item list-group-item-action"
//                 >
//                   {item.title}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <Pagination
//         items={data.hits}
//         pageSize={pageSize}
//         onPageChange={handlePageChange}
//       ></Pagination>
//     </Fragment>
//   );
// }

// // ========================================
// ReactDOM.render(<App />, document.getElementById("root"));
