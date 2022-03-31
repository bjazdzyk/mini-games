
let _W = window.innerWidth
let _H = window.innerHeight

let app = new PIXI.Application({ width: _W, height: _H });
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x0faaf0

const border_thickness = 5
const rows = 15
const cols = 20
const margin = 1
let cellSize = Math.min(_W/(cols+margin*2), _H/(rows+margin*2))
let width = cellSize*cols
let height = cellSize*rows
const speed = 6

let points = 0

let applePos = {}

let playing = true
let bigger = false


const T = {}
const S = [[1, 0], [0, 0]]

let direction = 1 
let unavaiableDir = 3

const board = new PIXI.Graphics()
app.stage.addChild(board)
const snake = new PIXI.Graphics()
app.stage.addChild(snake)
const apples = new PIXI.Graphics()
app.stage.addChild(apples)


const newApple = ()=>{
	let x = Math.floor(Math.random()*cols)
	let y = Math.floor(Math.random()*rows)
	while(T[vec2(x, y)]){
		x = Math.floor(Math.random()*cols)
		y = Math.floor(Math.random()*rows)
	}
	T[vec2(x, y)] = 2
	applePos.x = x
	applePos.y = y
}

const vec2 = (x, y)=>{
	return `${x}:${y}`
}

const updateBoard = ()=>{
	board.clear()
	apples.clear()
	//white rectangle
	board.beginFill(0xeeeeee)
	board.drawRect(0, 0, width, height)

	//grid
	board.lineStyle(1, 0xaaaaaa)
	for(let i=1; i<cols; i++){
		board.moveTo(i*cellSize, 0)
		board.lineTo(i*cellSize, height)
	}
	for(let i=1; i<rows; i++){
		board.moveTo(0, i*cellSize)
		board.lineTo(width, i*cellSize)
	}
	//outlines
	board.endFill()
	board.lineStyle(border_thickness, 0x000000)
	board.drawRect(-border_thickness/2, -border_thickness/2, width+border_thickness, height+border_thickness)

	//apple
	apples.beginFill(0xff0000)
	apples.drawRect(applePos.x*cellSize, applePos.y*cellSize, cellSize, cellSize)

	//position
	const offsetX = (_W-width)/2
	const offsetY = (_H-height)/2
	board.x = offsetX
	board.y = offsetY
	apples.x = offsetX
	apples.y = offsetY
}

const step = ()=>{
	const tail = S[S.length-1]
	for(let i=S.length-1; i>0; i--){
		S[i] = S[i-1]
	}

	if(bigger){
		bigger = false
		S.push(tail)
	}else{
		T[vec2(S[S.length-1][0], S[S.length-1][1])] = null
	}

	let head = S[0]
	let step = [0, 0]

	if(direction == 1){
		step = [1, 0]
	}else if(direction == 2){
		step = [0, 1]
	}else if(direction == 3){
		step = [-1, 0]
	}else if(direction == 4){
		step = [0, -1]
	}

	head = [head[0]+step[0], head[1]+step[1]]

	if(head[0]<0 || head[0]>=cols || head[1]<0 || head[1]>=rows || T[vec2(head[0], head[1])] == 1){
		playing = false
		return
	}else if(T[vec2(head[0], head[1])] == 2){
		points ++
		document.getElementById("score").innerHTML = points
		console.log(points)
		bigger = true
		newApple()
		updateBoard()
	}
	S[0] = head
	T[vec2(S[0][0], S[0][1])] = 1
	unavaiableDir = (direction+1)%4+1
	updateSnake()
}

const updateSnake = ()=>{
	snake.clear()
	snake.beginFill(0x00ff00)

	//segments
	for(let i of S){
		snake.drawRect(i[0]*cellSize, i[1]*cellSize, cellSize, cellSize)

	}

	//position
	const offsetX = (_W-width)/2
	const offsetY = (_H-height)/2
	snake.x = offsetX
	snake.y = offsetY
}

newApple()
updateBoard()
updateSnake()

for(let i=0; i<S.length-1; i++){
	T[vec2(S[i][0], S[i][1])] = 1
}


const keys = {}
window.addEventListener('keydown', (e)=>{
	keys[e.code] = true
})
window.addEventListener('keyup', (e)=>{
	keys[e.code] = null
})
const events = {
	ArrowRight(){
		if(unavaiableDir != 1){
			direction = 1

		}
	},
	ArrowDown(){
		if(unavaiableDir != 2){
			direction = 2

		}
	},
	ArrowLeft(){
		if(unavaiableDir != 3){
			direction = 3
		}
	},
	ArrowUp(){
		if(unavaiableDir != 4){
			direction = 4
		}
	}
}

let timeStamp = Date.now()
const loop = ()=>{

	requestAnimationFrame(loop)
	if(playing){
		if(Date.now()-timeStamp>=1000/speed){
			timeStamp = Date.now()
			step()
		}
	}

	for(const i in events){
		if(keys[i]){
			events[i]()
		}
	}

}
loop()


//window resize
window.addEventListener('resize', ()=>{
	_W = window.innerWidth
	_H = window.innerHeight
	cellSize = Math.min(_W/(cols+margin*2), _H/(rows+margin*2))
	width = cellSize*cols
	height = cellSize*rows
	app.renderer.resize(_W, _H)
	updateBoard()
	updateSnake()
})