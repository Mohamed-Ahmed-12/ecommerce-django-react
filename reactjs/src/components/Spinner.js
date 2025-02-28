import React, { memo } from "react";
function Spinner() {
    return (

        <div className="d-flex justify-content-center align-items-center">
            <div style={{ width: "3rem", height: "3rem" }} role="status" className="spinner-border text-primary">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>



    );
}

export default memo(Spinner);
