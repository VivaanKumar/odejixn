import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Moment from "react-moment";

const ranks = [{email: "kapura2@kgv.hk", rank: "Trusted"},{email: "samtaa2@kgv.hk", rank: "Trusted"},{email: "bishta1@kgv.hk", rank: "Mod"},  {email: "kumarv5@kgv.hk", rank: "Admin"}, ];

export default function GameInfo({ id, data }) {

    const [whiteData, setWhiteData] = useState();
    const [blackData, setBlackData] = useState();

    const whiteUid = data?.members.filter((member) => member?.white)[0].uid;
    const blackUid = data?.members.filter((member) => member?.black)[0].uid;

    useEffect(() => {
      db.collection("users").doc(whiteUid).get().then((u) => {
        setWhiteData(u.data());
      })
    }, [])

    useEffect(() => {
        db.collection("users").doc(blackUid).get().then((u) => {
          setBlackData(u.data());
        })
      }, [])

    console.log(whiteUid, blackUid);
    


    let whiteRank = ranks.filter((rank) => rank.email == whiteData?.email)[0];
    let blackRank = ranks.filter((rank) => rank.email == blackData?.email)[0];

    console.log(blackData?.email);

    // console.log(blackRank);
    
    

    // console.log(data?.members);

    // console.log(data);

    return (
        <div onClick={() => window.location.pathname = `/games/${id}`} className="flex items-start p-1 w-[100%] h-[80px] border border-[#1a1a1a] bg-black divide-x divide-[#1a1a1a] transition duration-200 ease-in-out hover:bg-[#0c0c0c] hover:cursor-pointer hover:shadow-md">
            <div className="flex items-center h-[100%] w-[40%] justify-start p-2">
                <div className="flex items-start space-x-4">
                    <div className="flex flex-col space-y-[6px] items-start justify-center">
                        <div title="This player has a rank" className="flex items-center space-x-2"><img src={whiteData?.photoURL} className="w-6 h-6 rounded-[5px]"/><p>{whiteRank ? <span className="flex items-center space-x-2">
                            <p className={`${whiteRank?.rank == "Trusted" && "text-gray-600"} ${whiteRank?.rank == "Mod" && "text-purple-700"} ${whiteRank?.rank == "Admin" && "text-red-700"} font-bold`}>{whiteRank.rank}</p>
                            <p>{whiteData?.displayName.substring(0, 10)}</p>
                        </span> : whiteData?.displayName.substring(0, 19)}</p></div>
                        <div title="This player has a rank" className="flex items-center space-x-2"><img src={blackData?.photoURL} className="w-6 h-6 rounded-[5px]"/><p>{blackRank ? <span className="flex items-center space-x-2">
                            <p className={`${blackRank?.rank == "Trusted" && "text-gray-600"} ${blackRank?.rank == "Mod" && "text-purple-700"} ${blackRank?.rank == "Admin" && "text-red-700"} font-bold`}>{blackRank.rank}</p>
                            <p>{blackData?.displayName.substring(0, 10)}</p>
                        </span> : blackData?.displayName.substring(0, 19)}</p></div>
                    </div>
                    {/* <MinusIcon className="w-5 h-5 bg-red-600 text-[white] rounded-[5px] items-center justify-center" /> */}
                </div>
            </div>
            <div className="flex items-center h-[100%] w-[20%] justify-center">
                <div className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-[6px] items-center justify-center">
                        {typeof data?.live == "undefined" || data?.live == false ? <>
                            <p className="">{data.loser == "w" ? "Black" : "White"}</p>
                        </> : <div className="bg-[#b23330] p-1 rounded-[5px] text-[white] space-x-2 flex">
                            <p>Live</p>
                            <img className="w-6 h-6" src="./spectate.png" />
                        </div>}                    </div>
                    {typeof data?.live == "undefined" || data?.live == false ? (data?.loser == "w" ? <MinusIcon className="w-5 h-5 bg-red-600 text-[white] rounded-[5px] items-center justify-center" /> :<PlusIcon className="w-5 h-5 bg-green-600 text-[white] rounded-[5px] items-center justify-center" /> ) : <></>}
                </div>
            </div>
            <div className="flex items-center h-[100%] w-[40%] justify-center ">
                <Moment fromNow>{data.gameCreatedAt.toDate()}</Moment>
            </div>


        </div>
    )
}

export {ranks};