import React, {useRef, useState, useEffect} from "react";
import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "@awconway/capnolabel-4";

function LinePlot({data, maxCo2}) {
  const ref = useRef();
  const [module, setModule] = useState();

  useEffect(() => {
    const runtime = new Runtime();
    const main = runtime.module(notebook, name => {
      if (name === "plot") return new Inspector(ref.current);
    });
    setModule(main);

    return () => {
      setModule(undefined);
      runtime.dispose();
    }
  }, []);

  // Propagate state from React to Observable.
  useEffect(() => {
    if (module !== undefined) {
      module.redefine("plotData", data);
      module.redefine("max", maxCo2);
    }
  }, [data, maxCo2, module]);

  return (
    <>
      <div ref={ref} />
    </>
  );
}

export default LinePlot