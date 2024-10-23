/* eslint-disable react/no-unknown-property */
function Arrow({
    origin,
    dir,
    length,
    color,
    arrowLength = 5,
    arrowWidth = 2,
}) {
    return (
        <>
            <arrowHelper
                args={[dir, origin, length, color, arrowLength, arrowWidth]}
            />
        </>
    );
}

export default Arrow;