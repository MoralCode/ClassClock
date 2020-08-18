import "../../global.css";
import "./SelectionList.css";

export interface ISelectProps {
    title: string;
    loading: boolean;
}

const SelectionList = (props: ISelectProps) => {


    return (
        <div>
            <h2>{props.title}</h2>
            {props.loading? (
                <span>Loading...</span>
            ) : (
                <ul className="selectionList">{list}</ul>
            )}

            {/* <a onClick={}>Refresh</a> */}
        </div>
    );
};

export default SelectionList;