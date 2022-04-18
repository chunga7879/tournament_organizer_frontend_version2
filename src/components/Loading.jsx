import '../css/Loading.scss';
import React, {useContext} from "react";
import {loading} from "../App";

export default function Loading() {
    const isLoading = useContext(loading);
    return isLoading > 0 && (
        <div className="Loading">
            <div>
                <span>Loading</span><span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    );
}