// "use client";
// import React, { useState, useEffect } from "react";
// import "./addLaundry.css";
// import { Select } from "@mui/material";
// import { Autocomplete, TextField } from "@mui/material";
// import Receipt from "@/app/role/staff/laundryBin/orderSummary";

// const AddLaundry = ({ isOpen, onClose, onSaveData }) => {
//   const [customerData, setCustomerData] = useState([]);
//   const [supplyData, setSupplyData] = useState([]);
//   const [laundryModeData, setLaundryModeData] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [weightModes, setWeightModes] = useState([]);
//   const [washModes, setWashModes] = useState([]);
//   const [dryModes, setDryModes] = useState([]);
//   const [foldMode, setFoldMode] = useState([]);
//   const [customerName, setCustomerName] = useState("");
//   const [orderDate, setOrderDate] = useState("");
//   const [weight, setWeight] = useState("");
//   const [washMode, setWashMode] = useState("");
//   const [dryMode, setDryMode] = useState("");
//   const [fold, setFold] = useState("");
//   const [colored, setColored] = useState("");
//   const [detergent, setDetergent] = useState("");
//   const [fabCon, setFabCon] = useState("");
//   const [detergentQty, setDetergentQty] = useState("");
//   const [fabConQty, setFabConQty] = useState();
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [machineData, setMachineData] = useState([]);
//   const [dryerData, setDryerData] = useState([]);
//   const [laundryOrderSummary, setLaundryOrderSummary] = useState(null);

//   let stock = 0;

//   // Fetch Machines
//   const fetchMachines = () => {
//     fetch("/api/machine", { cache: "no-store" })
//       .then((response) => response.json())
//       .then((data) => setMachineData(data.machineData || []))
//       .catch((error) => console.error("Error fetching machine data:", error));
//   };

//   useEffect(() => {
//     fetchMachines();
//   }, []);

//   // Assign Machine
//   const assignMachine = () => {
//     const availableMachine = machineData.find(
//       (m) => m.timer == "0" || m.timer == "00:00"
//     );
//     return +availableMachine.machineNumber;
//   };

//   // Fetch Dryers
//   const fetchDryers = () => {
//     fetch("/api/dryer", { cache: "no-store" })
//       .then((response) => response.json())
//       .then((data) => setDryerData(data.dryerData || []))
//       .catch((error) => console.error("Error fetching dryer data:", error));
//   };

//   useEffect(() => {
//     fetchDryers();
//   }, []);

//   // Assign Dryer
//   const assignDryer = () => {
//     const availableDryer = dryerData.find(
//       (d) => d.timer == "00:00" || d.timer == "0"
//     );
//     return +availableDryer.dryerNumber;
//   };

//   const onClick = async () => {
//     if (
//       !customerName ||
//       !orderDate ||
//       !weight ||
//       !washMode ||
//       !dryMode ||
//       !fold ||
//       !colored ||
//       !detergent ||
//       !fabCon ||
//       !paymentMethod
//     ) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     const numberRegex = /^\d+$/;
//     if (!numberRegex.test(detergentQty)) {
//       alert(
//         "Invalid characters in Detergent Qty. Please enter a valid number."
//       );
//       return;
//     }

//     if (!numberRegex.test(fabConQty)) {
//       alert(
//         "Invalid characters in Fabric Conditioner Qty. Please enter a valid number."
//       );
//       return;
//     }

//     // Assign machines and dryers
//     const machineNo = assignMachine();
//     const dryerNo = assignDryer();

//     // Handle the case where no available machine or dryer is found
//     if (machineNo === null || dryerNo === null) {
//       return;
//     }

//     // API call to save laundry data
//     const response = await fetch("/api/laundrybin", {
//       method: "POST",
//       body: JSON.stringify({
//         customerName,
//         orderDate,
//         weight,
//         washMode,
//         dryMode,
//         fold,
//         colored,
//         detergent,
//         fabCon,
//         detergentQty,
//         fabConQty,
//         paymentMethod,
//       }),
//     });
//     console.log(response);

//     setLaundryOrderSummary({
//       customerName,
//       orderDate,
//       weight,
//       washMode,
//       dryMode,
//       fold,
//       colored,
//       detergent,
//       fabCon,
//       detergentQty,
//       fabConQty,
//       paymentMethod,
//       totalAmount
//     });

//     const res = await fetch("/api/report", {
//       method: "POST",
//       body: JSON.stringify({
//         customerName: customerName,
//         reportDate: orderDate,
//         totalAmount: totalAmount,
//         paymentMethod: paymentMethod,
//       }),
//     });

//     const orderRes = await fetch("/api/order", {
//       method: "POST",
//       body: JSON.stringify({
//         date: orderDate,
//         name: customerName,
//         machineNo: machineNo,
//         machineAction: "",
//         machineTimer: "0",
//         dryerNo: dryerNo,
//         dryerAction: "",
//         dryerTimer: "0",
//         status: "",
//       }),
//     });

//      console.log("orderszzzzzz" + orderRes);



//     if (fabCon && fabConQty) {
//       const selectedFabCon = supplyData.find(
//         (supply) => supply.supplyName === fabCon
//       );
//       stock = parseInt(selectedFabCon.availableStock, 10) - +fabConQty;
//       if (selectedFabCon) {
//         const inventoryResponse = await fetch("/api/inventory", {
//           method: "POST",
//           body: JSON.stringify({
//             date: orderDate,
//             supplyName: fabCon,
//             supplyId: selectedFabCon._id,
//             quantity: fabConQty,
//             type: "Out",
//           }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (inventoryResponse.ok) {
//           console.log("Inventory record updated successfully");
//         } else {
//           console.error("Failed to update inventory record");
//         }

//         const res = await fetch(
//           `/api/supply?id=${selectedFabCon._id}`,
//           {
//             method: "PATCH",
//             body: JSON.stringify({ availableStock: stock }),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (res.ok) {
//           console.log("Supply record updated successfully");
//         } else {
//           console.error("Failed to update supply record");
//         }
//         window.location.reload();
//       }
//     }


//     onSaveData();
//     onClose();
//   };


//   useEffect(() => {
//     const fetchCustomer = async () => {
//       try {
//         const res = await fetch("/api/customer", {
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch customer");
//         }

//         const response = await res.json();
//         setCustomerData(response.customers);
//       } catch (error) {
//         console.error("Error fetching customer:", error);
//       }
//     };

//     fetchCustomer();
//   }, []);

//   const filterSuppliesByKeyword = (supplies, keyword) => {
//     return supplies.filter((supply) =>
//       supply.supplyName.toLowerCase().includes(keyword)
//     );
//   };

//   useEffect(() => {
//     const fetchSupplies = async () => {
//       try {
//         const res = await fetch("/api/supply", {
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch supplies");
//         }

//         const response = await res.json();
//         setSupplyData(response.supplies);

//         // calculateTotalAmount();
//       } catch (error) {
//         console.error("Error fetching supplies:", error);
//       }
//     };

//     fetchSupplies();
//   }, []);

//   useEffect(() => {
//     if (detergent && detergentQty) {
//       const selectedDetergent = supplyData.find(
//         (supply) => supply.supplyName === detergent
//       );
//       console.log("selectedDetergent:", selectedDetergent);
//       stock = parseInt(selectedDetergent.availableStock, 10) - +detergentQty;
//       if (selectedDetergent) {
//         const inventoryResponse = fetch("/api/inventory", {
//           method: "POST",
//           body: JSON.stringify({
//             date: orderDate,
//             supplyName: detergent,
//             supplyId: selectedDetergent._id,
//             quantity: detergentQty,
//             type: "Out",
//           }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (inventoryResponse.ok) {
//           console.log("Inventory record updated successfully");
//         } else {
//           console.error("Failed to update inventory record");
//         }


//         const res = fetch(
//           `/api/supply?id=${selectedDetergent._id}`,
//           {
//             method: "PATCH",
//             body: JSON.stringify({ availableStock: stock }),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (res.ok) {
//           console.log("Supply record updated successfully");
//         } else {
//           console.error("Failed to update supply record");
//         }
//       }
//     }
//   }, [detergent, detergentQty, supplyData]);  

//   const calculateTotalAmount = () => {
//     let total = 0;

//     if (!supplyData || supplyData.length === 0) {
//       console.error("Supply data not available.");
//       return;
//     }

//     const selectedWeightMode = weightModes.find(
//       (mode) => mode.modeName === weight
//     );
//     if (selectedWeightMode) {
//       total += selectedWeightMode.price;
//     }

//     const selectedWashMode = washModes.find(
//       (mode) => mode.modeName === washMode
//     );
//     if (selectedWashMode) {
//       total += selectedWashMode.price;
//     }

//     const selectedDryMode = dryModes.find((mode) => mode.modeName === dryMode);
//     if (selectedDryMode) {
//       total += selectedDryMode.price;
//     }

//     const selectedFoldMode = foldMode.find((mode) => mode.modeName === fold);
//     if (selectedFoldMode) {
//       total += selectedFoldMode.price;
//     }


//     setTotalAmount(total);
//   };

//   const getDetergentSupplies = () => {
//     const detergentSupplies = filterSuppliesByKeyword(supplyData, "detergent");
//     return detergentSupplies.map((supplies, i) => (
//       <option key={i}>  {supplies.supplyName} - ₱{supplies.productPrice}</option>
//     ));
//   };

//   const getConditionerSupplies = () => {
//     const conditionerSupplies = filterSuppliesByKeyword(
//       supplyData,
//       "conditioner"
//     );
//     return conditionerSupplies.map((supplies, i) => (
//       <option key={i}>  {supplies.supplyName} - ₱{supplies.productPrice}</option>
//     ));
//   };

//   useEffect(() => {
//     const fetchLaundryMode = async () => {
//       try {
//         const res = await fetch("/api/laundry-price", {
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           throw new Error("Failed to fetch laundry mode");
//         }

//         const response = await res.json();
//         setWeightModes(
//           response.laundryModeData.filter((mode) => mode.category === "Weight")
//         );
//         setWashModes(
//           response.laundryModeData.filter((mode) => mode.category === "Wash")
//         );
//         setDryModes(
//           response.laundryModeData.filter((mode) => mode.category === "Dry")
//         );
//         setFoldMode(
//           response.laundryModeData.filter((mode) => mode.category === "Fold")
//         );
//       } catch (error) {
//         console.error("Error fetching laundry modes:", error);
//       }
//     };

//     fetchLaundryMode();
//   }, []);

//   useEffect(() => {
//     calculateTotalAmount();
//   }, [weight, washMode, dryMode, fold]);

//   const closeReceipt = () => {
//     setLaundryOrderSummary(null);
//   };

//   return (
//     <>
//       {isOpen && (
//         <div className="form-container visible">
//           <div>
//             <p id="header">Add New Laundry</p>
//             <hr />
//             <div className="customer-info">
//               <p>Customer Name</p>
//               <Autocomplete
//                 className="select-name"
//                 value={customerName}
//                 onChange={(event, newValue) => setCustomerName(newValue)}
//                 options={customerData.map((customer) => customer.customerName)}
//                 renderInput={(params) => (
//                   <TextField {...params} variant="outlined" />
//                 )}
//               />
//               <p>Date</p>
//               <input
//                 type="date"
//                 value={orderDate.substring(0, 10)}
//                 onChange={(e) => setOrderDate(e.currentTarget.value)}
//               ></input>
//             </div>
//             <hr />
//             <div className="form-group">
//               <div id="first">
//                 <p>Weight</p>
//                 <select
//                   value={weight}
//                   onChange={(e) => setWeight(e.currentTarget.value)}
//                 >
//                   <option value=""></option>
//                   {weightModes.map((mode) => (
//                     <option key={mode.id} value={mode.modeName}>
//                       {mode.modeName} - ₱{mode.price}
//                     </option>
//                   ))}
//                 </select>
//                 <p>Fold</p>
//                 <select
//                   value={fold}
//                   onChange={(e) => setFold(e.currentTarget.value)}
//                 >
//                   <option value=""></option>
//                   {foldMode.map((mode) => (
//                     <option key={mode.id} value={mode.modeName}>
//                       {mode.modeName}
//                     </option>
//                   ))}
//                 </select>
//                 <p>Detergent</p>
//                 <select
//                   className="dropdown"
//                   onChange={(e) => setDetergent(e.target.value)}
//                 >
//                   <option value=""></option>
//                   <option value="None">None</option>
//                   {getDetergentSupplies()}
//                 </select>
//                 <p>Detergent Qty.</p>
//                 <input
//                   type="number"
//                   value={detergentQty}
//                   onChange={(e) => setDetergentQty(e.currentTarget.value)}
//                 ></input>
//               </div>

//               <div id="second">
//                 <p>Wash Mode</p>
//                 <select
//                   value={washMode}
//                   onChange={(e) => setWashMode(e.currentTarget.value)}
//                 >
//                   <option value=""></option>
//                   {washModes.map((mode) => (
//                     <option key={mode.id} value={mode.modeName}>
//                       {mode.modeName} - ₱{mode.price}
//                     </option>
//                   ))}
//                 </select>
//                 <p>Colored</p>
//                 <select
//                   value={colored}
//                   onChange={(e) => setColored(e.currentTarget.value)}
//                 >
//                   <option value=""></option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>
//                 <p>Fabric Conditioner</p>
//                 <select
//                   className="dropdown"
//                   onChange={(e) => setFabCon(e.target.value)}
//                 >
//                   <option value=""></option>
//                   <option value="None">None</option>
//                   {getConditionerSupplies()}
//                 </select>
//                 <p>Fabric Conditioner Qty.</p>
//                 <input
//                   type="number"
//                   value={fabConQty}
//                   onChange={(e) => setFabConQty(e.currentTarget.value)}
//                 ></input>
//               </div>

//               <div id="third">
//                 <p>Dry Mode</p>
//                 <select
//                   value={dryMode}
//                   onChange={(e) => setDryMode(e.currentTarget.value)}
//                 >
//                   <option value=""></option>
//                   {dryModes.map((mode) => (
//                     <option key={mode.id} value={mode.modeName}>
//                       {mode.modeName} - ₱{mode.price}
//                     </option>
//                   ))}
//                 </select>
//                 <p>Pay by:</p>
//                 <div className="radio-label">
//                   <input
//                     id="radiob"
//                     type="radio"
//                     name="paymentMethod"
//                     value="Cash"
//                     checked={paymentMethod === "Cash"}
//                     onChange={(e) => setPaymentMethod(e.currentTarget.value)}
//                   />{" "}
//                   Cash
//                   <input
//                     id="radiob"
//                     type="radio"
//                     name="paymentMethod"
//                     value="GCash"
//                     checked={paymentMethod === "GCash"}
//                     onChange={(e) => setPaymentMethod(e.currentTarget.value)}
//                   />
//                   Gcash
//                 </div>
//               </div>
//             </div>
//             <br />
//             <button className="cancel" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="save" onClick={onClick}>
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//       {laundryOrderSummary && (
//         <Receipt selectedOrder={laundryOrderSummary} onClose={closeReceipt} />
//       )}
//     </>
//   );
// };

// export default AddLaundry;



"use client";
import React, { useState, useEffect } from "react";
import "./addLaundry.css";
import { Select } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";
// import Receipt from "@/app/role/staff/laundryBin/orderSummary";

const AddLaundry = ({ isOpen, onClose, onSaveData, onUpdateSupply }) => {
  const [customerData, setCustomerData] = useState([]); // State for customers
  const [supplyData, setSupplyData] = useState([]); // State for supplies
  const [laundryModeData, setLaundryModeData] = useState([]); //State for Laundry modes prices
  const [totalAmount, setTotalAmount] = useState(0);
  const [weightModes, setWeightModes] = useState([]);
  const [washModes, setWashModes] = useState([]);
  const [dryModes, setDryModes] = useState([]);
  const [foldMode, setFoldMode] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [weight, setWeight] = useState("");
  const [washMode, setWashMode] = useState("");
  const [dryMode, setDryMode] = useState("");
  const [fold, setFold] = useState("");
  const [colored, setColored] = useState("");
  const [detergent, setDetergent] = useState("");
  const [fabCon, setFabCon] = useState("");
  const [detergentQty, setDetergentQty] = useState("");
  const [fabConQty, setFabConQty] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [refNum, setRefNum] = useState("");
  const [machineData, setMachineData] = useState([]);
  const [dryerData, setDryerData] = useState([]);
  const [laundryOrderSummary, setLaundryOrderSummary] = useState(null);

  let stock = 0;

  const fetchMachines = () => {
    fetch("/api/machine", {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch machine data");
        }
        return response.json();
      })
      .then((data) => {
        setMachineData(data.machineData || []); // Update machineData state
      })
      .catch((error) => {
        console.error("Error fetching machine data:", error);
      });
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const assignMachine = () => {
    console.log(machineData);
    const availableMachine = machineData.find((m) => m.timer === "00:00");
    console.log("available machines" + availableMachine);
    return +availableMachine.machineNumber;
  };

  const fetchDryers = () => {
    fetch("/api/dryer", {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch dryer data");
        }
        return response.json();
      })
      .then((data) => {
        setDryerData(data.dryerData || []); // Update dryerData state
      })
      .catch((error) => {
        console.error("Error fetching dryer data:", error);
      });
  };

  useEffect(() => {
    fetchDryers();
  }, []);

  const assignDryer = () => {
    console.log(dryerData);
    const availableDryer = dryerData.find((d) => d.timer === "00:00");
    console.log("available dryers" + availableDryer);
    return +availableDryer.dryerNumber;
  };

  const onClick = async () => {

    if (
      !customerName ||
      !orderDate ||
      !weight ||
      !washMode ||
      !dryMode ||
      !fold ||
      !colored ||
      !detergent ||
      !fabCon ||
      !paymentMethod
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const machineNo = assignMachine();
    const dryerNo = assignDryer();

    console.log(
      customerName,
      orderDate,
      weight,
      washMode,
      dryMode,
      fold,
      colored,
      detergent,
      fabCon,
      detergentQty,
      fabConQty,
      paymentMethod,
      refNum
    );

    const response = await fetch("/api/laundrybin", {
      method: "POST",
      body: JSON.stringify({
        customerName: customerName,
        orderDate: orderDate,
        weight: weight,
        washMode: washMode,
        dryMode: dryMode,
        fold: fold,
        colored: colored,
        detergent: detergent,
        fabcon: fabCon,
        detergentQty: detergentQty,
        fabconQty: fabConQty,
        paymentMethod: paymentMethod,
        refNum: refNum,
      }),
    });

    // setLaundryOrderSummary({
    //   customerName,
    //   orderDate,
    //   weight,
    //   washMode,
    //   dryMode,
    //   fold,
    //   colored,
    //   detergent,
    //   fabCon,
    //   detergentQty,
    //   fabConQty,
    //   paymentMethod,
    //   refNum,
    //   totalAmount,
    // });

    const res = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify({
        customerName: customerName,
        reportDate: orderDate,
        totalAmount: totalAmount,
      }),
    });

    const orderRes = await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify({
        date: orderDate,
        name: customerName,
        machineNo: machineNo,
        machineAction: "",
        machineTimer: "",
        dryerNo: dryerNo,
        dryerAction: "",
        dryerTimer: "",
        status: "",
      }),
    });

    console.log(response);
    console.log(res);
    console.log("orderszzzzzz" + orderRes);


    if (detergent && detergentQty) {
      const selectedDetergent = supplyData.find(
        (supply) => supply.supplyName === detergent
      );
      stock = parseInt(selectedDetergent.availableStock, 10) - +detergentQty;
      if (selectedDetergent) {
        const inventoryResponse = await fetch("/api/inventory", {
          method: "POST",
          body: JSON.stringify({
            date: orderDate,
            supplyName: detergent,
            supplyId: selectedDetergent._id,
            quantity: detergentQty,
            type: "Out",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (inventoryResponse.ok) {
          console.log("Inventory record updated successfully");
        } else {
          console.error("Failed to update inventory record");
        }


        const res = await fetch(
          `http://localhost:3000/api/supply?id=${selectedDetergent._id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ availableStock: stock }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          console.log("Supply record updated successfully");
        } else {
          console.error("Failed to update supply record");
        }
        window.location.reload();
      }
    }

    if (fabCon && fabConQty) {
      const selectedFabCon = supplyData.find(
        (supply) => supply.supplyName === fabCon
      );
      stock = parseInt(selectedFabCon.availableStock, 10) - +fabConQty;
      if (selectedFabCon) {
        const inventoryResponse = await fetch("/api/inventory", {
          method: "POST",
          body: JSON.stringify({
            date: orderDate,
            supplyName: fabCon,
            supplyId: selectedFabCon._id,
            quantity: fabConQty,
            type: "Out",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (inventoryResponse.ok) {
          console.log("Inventory record updated successfully");
        } else {
          console.error("Failed to update inventory record");
        }



        const res = await fetch(
          `http://localhost:3000/api/supply?id=${selectedFabCon._id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ availableStock: stock }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          console.log("Supply record updated successfully");
        } else {
          console.error("Failed to update supply record");
        }
        window.location.reload();
      }
    }

    const numberRegex = /^\d+$/;
    if (!numberRegex.test(detergentQty)) {
      alert("Invalid characters in Detergent Qty. Please enter a valid number.");
      return;
    }

    if (!numberRegex.test(fabConQty)) {
      alert("Invalid characters in Fabric Conditioner Qty. Please enter a valid number.");
      return;
    }

    onSaveData();
    onClose();


  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch("/api/customer", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch customer");
        }

        const response = await res.json();
        setCustomerData(response.customers);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, []);

  const filterSuppliesByKeyword = (supplies, keyword) => {
    return supplies.filter((supply) =>
      supply.supplyName.toLowerCase().includes(keyword)
    );
  };

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const res = await fetch("/api/supply", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch supplies");
        }

        const response = await res.json();
        setSupplyData(response.supplies);
      } catch (error) {
        console.error("Error fetching supplies:", error);
      }
    };

    fetchSupplies();
  }, []);

  const getDetergentSupplies = () => {
    const detergentSupplies = filterSuppliesByKeyword(supplyData, "detergent");
    return detergentSupplies.map((supplies, i) => (
      <option key={i}>{supplies.supplyName}</option>
    ));
  };

  const getConditionerSupplies = () => {
    const conditionerSupplies = filterSuppliesByKeyword(supplyData, "conditioner");
    return conditionerSupplies.map((supplies, i) => (
      <option key={i}>{supplies.supplyName}</option>
    ));
  };

  useEffect(() => {
    const fetchLaundryMode = async () => {
      try {
        const res = await fetch("/api/laundry-price", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch laundry mode");
        }

        const response = await res.json();
        setWeightModes(response.laundryModeData.filter((mode) => mode.category === "Weight"));
        setWashModes(response.laundryModeData.filter((mode) => mode.category === "Wash"));
        setDryModes(response.laundryModeData.filter((mode) => mode.category === "Dry"));
        setFoldMode(response.laundryModeData.filter((mode) => mode.category === "Fold"));
      } catch (error) {
        console.error("Error fetching laundry modes:", error);
      }
    };

    fetchLaundryMode();
  }, []);

  const calculateTotalAmount = () => {
    let total = 0;

    const selectedWeightMode = weightModes.find((mode) => mode.modeName === weight);
    if (selectedWeightMode) {
      total += selectedWeightMode.price;
    }

    const selectedWashMode = washModes.find((mode) => mode.modeName === washMode);
    if (selectedWashMode) {
      total += selectedWashMode.price;
    }

    const selectedDryMode = dryModes.find((mode) => mode.modeName === dryMode);
    if (selectedDryMode) {
      total += selectedDryMode.price;
    }

    const selectedFoldMode = foldMode.find((mode) => mode.modeName === fold);
    if (selectedFoldMode) {
      total += selectedFoldMode.price;
    }

    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [weight, washMode, dryMode, fold]);


  return (
    <>
      {isOpen && (
        <div className="form-container visible">
          <div>
            <p id="header">Add New Laundry</p>
            <hr />
            <div className="customer-info">
              <p>Customer Name</p>
              <Autocomplete
                className="select-name"
                value={customerName}
                onChange={(event, newValue) => setCustomerName(newValue)}
                options={customerData.map((customer) => customer.customerName)}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
              <p>Date</p>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.currentTarget.value)}
              ></input>
            </div>
            <hr />
            <div className="form-group">
              <div id="first">
                <p>Weight</p>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.currentTarget.value)}
                >
                  <option value=""></option>
                  {weightModes.map((mode) => (
                    <option key={mode.id} value={mode.modeName}>
                      {mode.modeName} - ₱{mode.price}
                    </option>
                  ))}
                </select>
                <p>Fold</p>
                <select
                  value={fold}
                  onChange={(e) => setFold(e.currentTarget.value)}
                >
                  <option value=""></option>
                  {foldMode.map((mode) => (
                    <option key={mode.id} value={mode.modeName}>
                      {mode.modeName}
                    </option>
                  ))}
                </select>
                <p>Detergent</p>
                <select
                  className="dropdown"
                  onChange={(e) => setDetergent(e.target.value)}
                >
                  <option value=""></option>
                  <option value="">None</option>
                  {getDetergentSupplies()}
                </select>
                <p>Detergent Qty.</p>
                <input
                  type="number"
                  value={detergentQty}
                  onChange={(e) => setDetergentQty(e.currentTarget.value)}
                ></input>
              </div>

              <div id="second">
                <p>Wash Mode</p>
                <select
                  value={washMode}
                  onChange={(e) => setWashMode(e.currentTarget.value)}
                >
                  <option value=""></option>
                  {washModes.map((mode) => (
                    <option key={mode.id} value={mode.modeName}>
                      {mode.modeName} - ₱{mode.price}
                    </option>
                  ))}
                </select>
                <p>Colored</p>
                <select
                  value={colored}
                  onChange={(e) => setColored(e.currentTarget.value)}
                >
                  <option value=""></option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <p>Fabric Conditioner</p>
                <select
                  className="dropdown"
                  onChange={(e) => setFabCon(e.target.value)}
                >
                  <option value=""></option>
                  <option value="">None</option>
                  {getConditionerSupplies()}
                </select>
                <p>Fabric Conditioner Qty.</p>
                <input
                  type="number"
                  value={fabConQty}
                  onChange={(e) => setFabConQty(e.currentTarget.value)}
                ></input>
              </div>

              <div id="third">
                <p>Dry Mode</p>
                <select
                  value={dryMode}
                  onChange={(e) => setDryMode(e.currentTarget.value)}
                >
                  <option value=""></option>
                  {dryModes.map((mode) => (
                    <option key={mode.id} value={mode.modeName}>
                      {mode.modeName} - ₱{mode.price}
                    </option>
                  ))}
                </select>
                <p>Pay by:</p>
                <div className="radio-label">
                  <input
                    id="radiob"
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === "Cash"}
                    onChange={(e) => setPaymentMethod(e.currentTarget.value)}
                  />{" "}
                  Cash
                  <input
                    id="radiob"
                    type="radio"
                    name="paymentMethod"
                    value="GCash"
                    checked={paymentMethod === "GCash"}
                    onChange={(e) => setPaymentMethod(e.currentTarget.value)}
                  />
                  Gcash
                </div>
              </div>
            </div>
            <br />
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="save" onClick={onClick}>
              Save
            </button>
          </div>
        </div>
      )}
      {/* <Receipt
      selectedOrder={setLaundryOrderSummary}
      /> */}
    </>
  );
};

export default AddLaundry;