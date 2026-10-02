import DateTimeYear from "./DateTimeYear";
import HKWeatherPanel from "./HKWeatherPanel";
function TopOfHomePage (){
    return (
        <div className="hidden md:block">
            <div className="topofhome">
                <div className="top-group">
                    <div className="top-items"><HKWeatherPanel/></div>
                    <div className="top-items"><DateTimeYear/></div>
                </div>
            </div>
        </div>
    )
}

export default TopOfHomePage;