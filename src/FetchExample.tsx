/** @jsx j */
import { j } from "./react";
import ReactDOM from "./react";

export function FetchExample () {
  const [randomCat, setRandomCat] = ReactDOM.useState(undefined);
  const [isLoading, setIsLoading] = ReactDOM.useState(true);

  ReactDOM.useEffect(() => {
    fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => response.json())
        .then(data => {
          setIsLoading(() => false)
          setRandomCat(() => data[0])
        });
  }, [])

  if(isLoading || !randomCat) {
    return <span>Loading...</span>
  }

  return (
    <div className="fetch-content">
      <span className="title">Fetch example</span>
      <div className="picture">
        <img src={randomCat.url} height={randomCat.height} width={randomCat.width}></img>
      </div>
    </div>
  );
};
