import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CardComponent } from "../components/card";

export default function BrainPage() {
    const { link } = useParams<{ link: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { 
        async function fetchData() {
            if (!link) {
                setError("No link provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/app/v1/brain/${link}`);
                setData(response.data);
                console.log("Brain page data:", response.data);
            } catch (error) {
                console.error("Error fetching brain page data:", error);
                setError("Failed to load brain page data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [link]);
    
    return (
        <>
        <div className="bg-yellow-50 min-h-screen p-6" >
            {/*page component mei data given */}
            <Page data={data} loading={loading} error={error} />
        </div>
        </>
    );
}
// page component defination
interface PageProps {
    data: any;
    loading: boolean;
    error: string | null;
}

const Page = ({ data, loading, error }: PageProps) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading brain page...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">No data available</div>
            </div>
        );
    }

    return (
        <div className=" ">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
                <p className="text-lg text-gray-700">
                    You are viewing {data.username || 'a user'}'s brain
                </p>
            </div>

            <div className="flex items-center justify-center">

              <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-5">
                  {data.content && data.content.length > 0 ? (
                      data.content.map((item: any) => (
                          <CardComponent 
                              key={item._id} 
                              type={item.type}
                              heading={item.title} 
                              tags={item.tags || []}
                              url={item.link}
                          />
                      ))
                  ) : (
                      <div className="col-span-full text-center text-gray-600">
                          No content available in this brain.
                      </div>
                  )}
              </div>
            </div>
        </div>
    );
}
