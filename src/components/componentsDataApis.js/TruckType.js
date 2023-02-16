import React from 'react'
import { Form } from 'react-bootstrap'

const SelectTruckType = ({name,value,onChange}) => {
    return (
        <Form.Select name={name} value={value} onChange={onChange}>
            <option value={"Box truck"}>Box truck</option>
            <option value={"Chassis Cab"}>Chassis Cab</option>
            <option value={"Dump Truck"}>Dump Truck</option>
            <option value={"Flatbed Truck"}>Flatbed Truck</option>
            <option value={"Tipper 10 Tyre"}>Tipper 10 Tyre</option>
        </Form.Select>
    )
}

export default SelectTruckType