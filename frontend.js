import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const fetchPrediction = () => {
    fetch("http://localhost:5000/predict")
      .then((res) => res.json())
      .then((result) => setPrediction(result));
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Real-Time Sensor Data</h2>
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            <Line type="monotone" dataKey="power_output" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Predictive Maintenance</h2>
          <Button onClick={fetchPrediction} className="mb-4">Get Prediction</Button>
          {prediction && (
            <p className="text-lg">Failure Risk: <strong>{prediction.risk}%</strong></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
