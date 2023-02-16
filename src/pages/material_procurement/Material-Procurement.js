import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment/moment";
import { TAB_ITEMS } from "./data";
import Table from "./Table";
import SupplierInfo from "./SupplierInfo";
import { Rating } from "react-simple-star-rating";
import RatingModal from "./RatingModal";
import PODetailDisabled from "./PODeatailDiabled";

const applySearchFilter = (query, activities) => {
  console.log("activities", activities);
  return activities?.filter((activity, index) => {
    let matches = true;
    let containsQuery = false;
    const properties = ["title", "site", "status", "id"];

    properties.forEach((property) => {
      if (
        activity[property]
          ?.toString()
          ?.toLowerCase()
          ?.includes(query?.toLowerCase())
      ) {
        containsQuery = true;
        matches = true;
      }

      if (!containsQuery) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyStatusFilter = (query, activities) => {
  if (query && query !== "All") {
    return activities?.filter(
      (x) => x?.status.toLowerCase() == query?.toLowerCase()
    );
  } else {
    return activities;
  }
  //
};

const MaterialProcrementTab = () => {
  const [first, setfirst] = useState();
  const navigate = useNavigate();
  const [Index, setIndex] = useState(0);
  const [data, setData] = useState([]);
  const [dataUE, setDataUE] = useState([]);
  const [modal, setModal] = useState(false);
  const [poModal, setPOModal] = useState(false);
  const [data2, setData2] = useState({});

  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [PAstatus, setPAStatus] = useState("");
  const [completed, setCompleted] = useState([]);
  const [ratingModal, setRatingModal] = useState(false);
  const [poId, setPoId] = useState();
  const [vendorId, setVendorId] = useState();
  const [POData, setPOData] = useState();
  const appliedActivities = applySearchFilter(search, data?.data);
  const filteredActivities = applyStatusFilter(PAstatus, appliedActivities);

  const scm_user=JSON.parse(sessionStorage.getItem("scm_user"))

  const handleNavigate = (x, index) => {
    setIndex(index);
  };
  const handlePOModal = (POId) => {
    console.log(scm_user,"scm_user---")
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          `https://scm.acolabz.com/backend/api/Procurements/activities/po/${POId}`,

          {
            headers: {
              Authorization: "Bearer "+scm_user.token,
            },
          }
        );
        setPOData(response.data);
        console.log("PO details", response);
        setPOModal(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  const handleRatingModal = (id, vid) => {
    setRatingModal(true);
    setPoId(id);
    setVendorId(vid);
  };
  const handleCloseRM = () => {
    setRatingModal(false);
  };

  const handleStatus = (e) => {
    setPAStatus(e.target.value);
  };
  const handleNavigatePODetail = (id) => {
    navigate(`/purchase-order-details/${id}`);
  };
  const navigatePA = () => {
    navigate("/add-procurement-activity");
  };
  const handleDetails = (id) => {
    navigate(`/add-procurement-bids/${id}`);
  };
  const handleClose = () => {
    setModal(false);
  };

  const showModal = (supplierId) => {
    console.log(scm_user.token,"scm_user.token---")
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          `https://scm.acolabz.com/backend/api/vendor/supplier/${supplierId}?module=Supplier`,

          {
            headers: {
              Authorization:"Bearer "+scm_user.token,
            },
          }
        );
        console.log("Supplier response", response);
        setModal(true);
        setData2(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  };
  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          "https://scm.acolabz.com/backend/api/Procurements/activities",
          {
            headers: {
              Authorization: "Bearer "+scm_user.token,
            },
          }
        );
        console.log("response", response);
        setLoader(false);
        setData(response);
      } catch (error) {
        setLoader(false);
        setData(error);
      }
    };
    fetchData();
    const fetchData1 = async () => {
      try {
        const { data: response } = await axios.get(
          "https://scm.acolabz.com/backend/api/Procurements/activities/po/completed",
          {
            headers: {
              Authorization:"Bearer "+scm_user.token,
            },
          }
        );
        console.log("response @@@", response.data);
        setCompleted(response.data);
        // setLoader(false);
        // setData(response);
      } catch (error) {
        setLoader(false);
        setData(error);
      }
    };
    fetchData1();
    const fetchData2 = async () => {
      try {
        const { data: response } = await axios.get(
          "https://scm.acolabz.com/backend/api/procurements/activities/underexecution?search",
          {
            headers: {
              Authorization:"Bearer "+scm_user.token,
            },
          }
        );
        setLoader(false);
        setDataUE(response);
      } catch (error) {
        setLoader(false);
        setDataUE(error);
      }
    };
    fetchData2();
  }, []);

  console.log("dataUE", dataUE);
  const sizePerPageList = [
    {
      text: "10",
      value: 10,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "All",
      value: data?.data?.result?.length,
    },
  ];

  const columns = [
    {
      Header: "Procurement ID",
      accessor: "id",
      sort: false,
    },
    {
      Header: "Title",
      accessor: "title",
      sort: false,
    },
    {
      Header: "Site/Location",
      accessor: "site",
      sort: false,
    },
    {
      Header: "Materials",
      accessor: "materials",
      sort: false,
    },
    {
      Header: "Created on",
      accessor: "created_at",
      sort: false,
      Cell: ({ created_at }) => {
        return moment(created_at).format("DD MMM YYYY");
      },
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
    },
    {
      Header: "Status Updated on",
      accessor: "status_updated_at",
      sort: false,
      Cell: ({ status_updated_at }) => {
        return moment(status_updated_at).format("DD MMM YYYY");
      },
    },
    {
      Header: "View",
      accessor: (data) => data.id,
      sort: false,

      Cell: ({ row }) => (
        <div
          onClick={() => handleDetails(row.original.id)}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          View
        </div>
      ),
    },
  ];
  const columnsUE = [
    {
      Header: "PO Number",
      accessor: "po_number",
      sort: false,
      Cell: ({ row }) => (
        <div
          onClick={() => handlePOModal(row?.original.id)}
          // onClick={() => handleDetails(row.original.id)}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {row?.original?.po_number}
        </div>
      ),
    },
    {
      Header: "PO Date",
      accessor: "po_date",
      sort: false,
      Cell: ({ po_date }) => {
        return moment(po_date).format("DD MMM YYYY");
      },
    },
    {
      Header: "PO Value",
      accessor: "po_value",
      sort: false,
    },
    {
      Header: "Supplier",
      accessor: "client_name",
      sort: false,
      Cell: ({ row }) => (
        <div
          onClick={() => showModal(row.original.vendor_id)}
          // onClick={() => handleDetails(row.original.id)}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {row?.original?.client_name}
        </div>
      ),
    },
    {
      Header: "Created on",
      accessor: "status_updated_on",
      sort: false,
      Cell: ({ created_at }) => {
        return moment(created_at).format("DD MMM YYYY");
      },
    },
    {
      Header: "Status",
      accessor: "po_status",
      sort: false,
    },
    {
      Header: "Status Updated on",
      accessor: "status_updated_at",
      sort: false,
      Cell: ({ status_updated_at }) => {
        return moment(status_updated_at).format("DD MMM YYYY");
      },
    },
    {
      Header: "Details",
      // accessor: (data) => data.id,
      sort: false,
      Cell: ({ row }) => (
        <div
          onClick={() => handleNavigatePODetail(row.original.id)}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          View
        </div>
      ),
    },
  ];
  console.log("POData", POData);
  return (
    <>
      <Row>
        <Col>
          <div className="page-title-box">
            <div className="page-title-right">
              <form className="d-flex">
                <button className="btn btn-primary ms-2" onClick={navigatePA}>
                  <i className="mdi"> + </i> Procurement Activity
                </button>
              </form>
            </div>
            <h4 className="page-title">Material Procurement</h4>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={12} lg={12}>
          <ul class="nav nav-tabs">
            {TAB_ITEMS?.map((x, index) => (
              <li class="nav-item" onClick={() => handleNavigate(x, index)}>
                <a
                  style={{ cursor: "pointer" }}
                  class={
                    Index === index ? "active-tab nav-link " : "nav-link active"
                  }
                  aria-current="page"
                >
                  {x.text}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "10px", justifyContent: "right", display: "flex" }}
      >
        <Col
          xl={2}
          sm={12}
          md={6}
          style={{
            justifyContent: "center",
            height: "12px",
            marginTop: "30px",
          }}
        >
          <input
            type="text"
            class="form-control"
            id="formGroupExampleInput2"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col
          xl={2}
          sm={12}
          md={6}
          style={{ justifyContent: "center", display: "grid" }}
        >
          <div>
            <select
              onChange={(e) => handleStatus(e)}
              name="cars"
              id="cars"
              style={{
                height: "35px",
                width: "180px",
                marginTop: "30px",
                border: "1px solid #dee2e6",
                justifyContent: "center",
              }}
            >
              <option value="">All</option>
              <option value="Specs Created">Specs Created</option>
              <option value="Invited for Quote">Invited for Quote</option>
              <option value="Bid Received">Bid Received</option>
              <option value="PO Awarded">PO Awarded</option>
              <option value="PO Rejected">PO Rejected</option>
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        {loader ? (
          <div class="d-flex justify-content-center">
            <div
              class="spinner-border mt-5"
              style={{ height: "100px", width: "100px", fontSize: "20px" }}
              role="status"
            >
              {/* <span class="sr-only">Loading...</span> */}
            </div>
          </div>
        ) : (
          Index === 0 &&
          (typeof data === "string" ? (
            <h1>{data}</h1>
          ) : (
            <>
              <Col xl={12} lg={12}>
                <Table
                  columns={columns}
                  data={filteredActivities ?? []}
                  pageSize={10}
                  isSortable={true}
                  pagination={true}
                  sizePerPageList={sizePerPageList}
                />
              </Col>
            </>
          ))
        )}

        {Index === 1 && (
          <>
            <Col xl={12} lg={12}>
              <Col xl={12} lg={12}>
                <Table
                  columns={columnsUE}
                  data={dataUE?.data ?? []}
                  pageSize={10}
                  isSortable={true}
                  pagination={true}
                  sizePerPageList={sizePerPageList}
                />
              </Col>
            </Col>
          </>
        )}

        {Index === 2 && (
          <>
            <Col xl={12} lg={12}>
              <div class="table-responsive text-nowrap">
                {completed.length > 0 ? (
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">PO Number</th>
                        <th scope="col">PO Date</th>
                        <th scope="col">PO Value</th>
                        <th scope="col">Supplier</th>
                        <th scope="col">Material</th>

                        <th scope="col">Completed on</th>
                        <th scope="col">Details</th>
                        <th scope="col">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completed?.map((obj) => (
                        <tr>
                          <th
                            onClick={() => handlePOModal(obj?.id)}
                            scope="row"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {obj?.po_number}
                          </th>
                          <td>{moment(obj?.po_date).format("DD MMM YYYY")}</td>
                          <td>{obj?.po_value}</td>

                          <td
                            onClick={() => showModal(obj?.vendor_id)}
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {obj?.vendor_name}
                          </td>
                          <td>{obj?.material_name}</td>
                          <td>
                            {moment(obj?.completed_on_date).format(
                              "DD MMM YYYY"
                            )}
                          </td>
                          <td>missing detail</td>
                          <td>
                            <Rating
                              initialValue={obj?.rating}
                              readonly={true}
                              size={20}
                            />
                            <i
                              onClick={() =>
                                handleRatingModal(obj?.id, obj?.vendor_id)
                              }
                              className=" dripicons-message"
                              style={{
                                cursor: "pointer",
                                width: "100%",
                                marginLeft: "10px",
                                marginTop: "5px",
                              }}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <h1 className="text-center mt-3">Record Not Found</h1>
                )}
              </div>
            </Col>
          </>
        )}
        {modal ? (
          <SupplierInfo modal={modal} handleClose={handleClose} data={data2} />
        ) : null}
        {poModal && (
          <PODetailDisabled
            poModal={poModal}
            setPOModal={setPOModal}
            POData={POData}
          />
        )}
        {ratingModal && (
          <RatingModal
            poId={poId}
            ratingModal={ratingModal}
            vendorId={vendorId}
            setRatingModal={setRatingModal}
            handleCloseRM={handleCloseRM}
          />
        )}
      </Row>
    </>
  );
};

export default MaterialProcrementTab;
