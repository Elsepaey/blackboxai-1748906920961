import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSharedFile } from "../utils/apiService";

const BranchDeepLinkHandler = () => {
  const navigate = useNavigate();
  const { fileId } = useParams();

  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileData = async (id) => {
      console.log("fetchFileData called with fileId:", id);
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching shared file for fileId:", id);
        const result = await getSharedFile(id);
        console.log("API result:", result);
        if (result.success) {
          console.log("Setting fileData and navigating");
          setFileData(result.data);
          navigate(`/preview/${id}`, { replace: true });
        } else {
          console.log("API call failed with error:", result.error);
          setError(result.error);
        }
      } catch (err) {
        console.log("Error in fetchFileData catch:", err);
        setError("Failed to fetch shared file");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    if (fileId) {
      fetchFileData(fileId);
    }
  }, [fileId, navigate]);

  return null;
};

export default BranchDeepLinkHandler;
