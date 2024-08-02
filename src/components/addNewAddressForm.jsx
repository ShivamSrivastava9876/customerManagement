"use client";

import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  getCityDetails,
  getDataByPostcodeAsync,
  getStateDetails,
  loadingStatusOfPostcode,
} from "@/lib/features/pincodeData/pincodeDataSlice";

const AddAddress = ({
  customerDetail,
  handleCloseAddForm,
  customerDetails,
  setCustomerDetails,
}) => {
  const dispatch = useDispatch();
  const [addressLineOne, setAddressLineOne] = useState("");
  const [addressLineTwo, setAddressLineTwo] = useState("");
  const [postcode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const loadingOfPostcode = useSelector(loadingStatusOfPostcode);
  let fetchedCityName = useSelector(getCityDetails);
  let fetchedStateName = useSelector(getStateDetails);

  // Update city when fetchedCityName changes
  useEffect(() => {
    if (fetchedCityName && postcode !== "") {
      setCity(fetchedCityName);
    }
  }, [fetchedCityName, postcode]);

  // Update state when fetchedStateName changes
  useEffect(() => {
    if (fetchedStateName && postcode !== "") {
      setState(fetchedStateName);
    }
  }, [fetchedStateName, postcode]);

  //Used debouncing to avoid multiple API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return function (panCardReceived) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(panCardReceived);
      }, delay);
    };
  };

  // Fetch Postal Code details
  const fetchPostalCodeDetails = (postalCodeReceived) => {
    dispatch(getDataByPostcodeAsync({ postcode: postalCodeReceived }));
  };

  const debouncedFetchPostalCodeDetails = useMemo(
    () => debounce(fetchPostalCodeDetails, 1000),
    []
  );

  const handlePostalCodeApi = (e) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setPostCode(value);
    }
    debouncedFetchPostalCodeDetails(e.target.value);
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      addressLineOne !== "" &&
      postcode !== "" &&
      (fetchedCityName !== "" || city !== "") &&
      (fetchedStateName !== "" || state !== "")
    ) {
      // Fetch existing customers from local storage
      const customers = JSON.parse(localStorage.getItem("customerData")) || [];
      console.log("newCustomer", customers);

      // Find the index of the customer being edited
      const customerIndex = customers.findIndex(
        (customer) => customer.emailId === customerDetail.emailId
      );

      if (customerIndex !== -1) {
        // Add new address to the customer's address list
        if (customers[customerIndex].addresses.length < 11) {
          customers[customerIndex].addresses.push({
            id: generateUniqueId(), // Generate a unique ID for the address
            addressLineOne,
            addressLineTwo,
            postcode,
            city,
            state,
          });

          // Save updated customers list to local storage
          localStorage.setItem("customerData", JSON.stringify(customers));

          alert("New address added successfully");

          //After adding new address re rendering the new customer list
          const storedCustomerData =
            JSON.parse(localStorage.getItem("customerData")) || [];
          setCustomerDetails(storedCustomerData);

          //Making the form fields empty
          setCity("");
          setState("");
        } else {
          alert(
            "Addresses have reached its maximum number, no more address can be added"
          );
        }
      }

      // Close the form
      handleCloseAddForm();
    } else {
      alert("Please fill all required fields");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        id="addAddressForm"
        className="bg-white p-8 shadow-md rounded-lg w-full max-w-sm md:max-w-md max-h-screen overflow-y-auto landscape:max-h-[80vh]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4">
            <h2 className=" text-[#0a0a0a] text-center text-2xl text-16px m-3 w-161">
              ADD NEW ADDRESS
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">PAN</label>
              <input
                type="text"
                name="panCardNo"
                disabled
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={customerDetail.panCardNo}
                placeholder="PAN number"
              />
            </div>

            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                Full name
              </label>
              <input
                type="text"
                disabled
                name="fullName"
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={customerDetail.fullName}
                placeholder="Full name"
              />
            </div>

            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                Email Id
              </label>{" "}
              <input
                type="text"
                name="emailId"
                disabled
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={customerDetail.emailId}
                placeholder="Email Id"
              />
            </div>

            <div className="relative  md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                Mobile number
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-xs md:text-sm text-[#111010]">
                  +91
                </span>
                <input
                  type="text"
                  name="mobileNo"
                  disabled
                  className="w-full pl-12 py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                  value={customerDetail.mobileNo}
                  placeholder="Mobile number"
                />
              </div>
            </div>

            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                Address line 1 (required)
              </label>
              <input
                type="text"
                name="addressLineOne"
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={addressLineOne}
                onChange={(e) => setAddressLineOne(e.target.value)}
                placeholder="Address Line 1"
              />
            </div>

            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                Address line 2{" "}
              </label>
              <input
                type="text"
                name="addressLineTwo"
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={addressLineTwo}
                onChange={(e) => setAddressLineTwo(e.target.value)}
                placeholder="Address Line 2"
              />
            </div>

            <div className="relative md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                Postal code (required)
              </label>
              <input
                type="number"
                name="postalCode"
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={postcode}
                onChange={handlePostalCodeApi}
                placeholder="Postal code"
              />
              {loadingOfPostcode === "loading" && (
                <div className="absolute right-9 top-8 w-5 h-5 border-4 border-gray-200 border-t-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">City </label>
              <input
                type="text"
                name="city"
                disabled
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={city}
                placeholder="City"
              />
            </div>

            <div className=" md:w-21.375">
              <label className="text-xs md:text-sm text-[#111010]">
                State{" "}
              </label>
              <input
                type="text"
                name="state"
                disabled
                className="w-full py-2 px-3 text-xs md:text-sm h-3.3125 flex flex-row items-center justify-center border rounded-sm outline-none border-[#9C9C9C] text-[#111010]"
                value={state}
                placeholder="State"
              />
            </div>
          </div>

          <div
            id="buttons"
            className="w-full flex justify-center sm:justify-end"
          >
            <Button
              type="submit"
              className="rounded-sm h-3.3125 md:w-21.375 m-4 font-normal text-white py-2 transition duration-300"
            >
              Add Address
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseAddForm}
              className="rounded-sm h-3.3125 md:w-21.375 m-4 font-normal text-white py-2 transition duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
