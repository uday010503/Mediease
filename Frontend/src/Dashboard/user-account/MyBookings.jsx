import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { formatDate } from "../../utils/formatDate";

const MyBookings = () => {
  const handleJoinMeeting = (url) => {
    window.open(url, "_blank");
  };
  const {
    data: appointments,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`);
  // console.log(appointments);
  return (
    <div>
      {loading && !error && <Loading />}
      {error && !loading && <Error errMessage={error} />}
      {!loading && !error && (
        // <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        //   {/* {appointments.map((doctor) => (
        //      <DoctorCard doctor={doctor} key={doctor._id} /> patient mkc
        //   ))} */}
        // </div>
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Doctor Name
              </th>
              <th scope="col" className="px-6 py-3">
                Fees
              </th>
              <th scope="col" className="px-6 py-3">
                Schedule
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((item) => (
              <tr key={item._id} className="border-b-2 border-gray-200">
                <th scope="row" className=" text-gray-900 ap">
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      {item.doctor.name}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{item.ticketPrice}</td>
                <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
                <td className="px-6 py-4">
                  <button
                    className=" bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
              border-blue-500 hover:bg-transparent hover:text-blue-500 teansition-all duration-300"
                    onClick={() => handleJoinMeeting(item.join_url)}
                  >
                    {" "}
                    Join Meeting
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && appointments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          You have not book any Doctor Yet!
        </h2>
      )}
    </div>
  );
};

export default MyBookings;
