import "./App.css";
import * as React from "react";
import { ReminderForm } from "./components/ReminderForm";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ReminderForm />
      </header>
    </div>
  );
}
