
const Constants = {

    nodeWidth: 30,
    nodeHeight: 30,

    BackgroundColor: 'rgba(23,174,239,0.07)',
    DefaultNodeColor: "rgba(48,193,255,0.2)",
    WallNodeColor: '#8D6F64',
    VisitedNodeColor: '#c377f8',
    ShortestNodeColor: '#7DDA58',
    visitingNodeColor: '#ffd200',

    //Bigger values means slower animation speed
    //note don't go below 10 cause js .....
    //didn't test how low it can get, but probably it can't get a lot lower
    visitedAnimationTimeOut: 10,
    pathAnimationTimeOut: 30,
    mazeGenerationTimeOut: 50,

    // Modifiers to change the speed
    // higher value means slower speed
    fastSpeedModifier: 0,
    normalSpeedModifier: 50,
    slowSpeedModifier: 100,
}
export default Constants