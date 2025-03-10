
const Constants = {
    nodeWidth: 30,
    nodeHeight: 30,

    BackgroundColor: 'rgba(23,174,239,0.07)',

    DefaultNodeColor: "rgba(48,193,255,0.2)",
    WallNodeColor: '#8D6F64',
    VisitedNodeColor: '#c377f8',
    ShortestNodeColor: '#7DDA58',

    //Bigger values means slower animation speed
    //note don't go below 20 cause js just slow as shit
    //didn't tested how low it can get but prolly it can't get a lot lower
    visitedAnimationTimeOut: 20,
    pathAnimationTimeOut: 50,
}
export default Constants