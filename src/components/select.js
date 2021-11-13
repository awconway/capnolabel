import React from 'react';
import {
    Listbox,
    ListboxInput,
    ListboxButton,
    ListboxPopover,
    ListboxList,
    ListboxOption,
  } from "@reach/listbox";
import "@reach/listbox/styles.css";

function Select({pids, onChange}) {
    return (
        <Listbox defaultValue={pids[0]} onChange={onChange} >
         {pids.map(pid => {
                return <ListboxOption value={pid}>{pid}</ListboxOption>
            })}
        </Listbox>
      );
}
