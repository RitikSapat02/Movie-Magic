import { React, useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SingleContent from "../../components/SingleContent";
import axios from "axios";
import CustomPagination from "../../components/Pagination/CustomPagination";

import { WidthWideOutlined } from "@mui/icons-material";
const apiKey = "ad42d50c0ab12bbf3d9862002e45562c";

function Search() {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#fff",
      },
    },
  });

  const fetchSearch = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/${
        type ? "tv" : "movie"
      }?api_key=${apiKey}&language=en-US&query=${searchText}&page=${page}&include_adult=false`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
    console.log(data.results);
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch();
  }, [page, type]);

  return (
    <div className="bg-[263745]">
      <div className="text-[white] text-[5vw] text-center bg-[#263745]">
        <ThemeProvider theme={darkTheme}>
          <div className="flex my-[15px] justify-center">
            <TextField
              style={{ flex: 1 }}
              className="searchBox"
              label="Search"
              variant="filled"
              onChange={(e) => setSearchText(e.target.value)}
            ></TextField>
            <Button
              style={{ marginLeft: 10 }}
              variant="contained"
              onClick={fetchSearch}
            >
              <SearchIcon />
            </Button>
          </div>
          <Tabs
            value={type}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newValue) => {
              setType(newValue);
              setPage(1);
            }}
          >
            <Tab label="search movies" />
            <Tab label="search series" />
          </Tabs>
        </ThemeProvider>
        <div className=" container mx-[auto] flex flex-wrap justify-around w-[100%]">
          {content &&
            content.map((c) => (
              <SingleContent
                key={c.id}
                id={c.id}
                poster={c.poster_path}
                title={c.title || c.name}
                date={c.release_date}
                voteAverage={c.vote_average}
                overView={c.overview}
                type={"movie" || "tv"}
                voteaverage={c.vote_average}
              />
            ))}

          {searchText &&
            !content &&
            (type ? <h2>No Series Found</h2> : <h2>No Movies Found</h2>)}
        </div>
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} />
        )}
      </div>
    </div>
  );
}

export default Search;
