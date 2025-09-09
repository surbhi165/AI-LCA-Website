import React, { useState } from "react";
import InputForm from "../InputForm";
import Results from "../Results";

function Configure() {
  const [result, setResult] = useState(null);

  return (
    <div>
      <InputForm onSubmit={setResult} />
      {result && <Results result={result} />}
    </div>
  );
}

export default Configure;
