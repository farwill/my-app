import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = `square ${props.highlight}`;
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const line = this.props.line;
    const highlight = (line && line.includes(i)) ? 'square-highlight' : '';
    return (
      <Square
        value={this.props.squares[i]}
        highlight={highlight}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = Array(3).fill(null);
    const cells = rows;
    let position = 0;
    const rowsWrap = rows.map((row, i) => {
      const cellsWrap = cells.map((cell, j) => {
        // const position = (rows.length * i) + j;
        return (
          <span key={position}>{this.renderSquare(position++)}</span>
        );
      });
      return (
        <div className="board-row" key={i}>{cellsWrap}</div>
      );
    });
    return (
      <div>
        {rowsWrap}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  toggle() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner_line = calculateWinner(current.squares);
    const winner = winner_line ? winner_line.winner : null;
    const line = winner_line ? winner_line.line : null;
    const moves = history.map((step, move) => {
      const position = step.position
      const col = position % 3 + 1;
      const row = Math.floor(position / 3 + 1);
      const desc = move ?
        'Go to move # ' + move + ' (' + col + ',' + row + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={this.state.stepNumber === move ? 'btn-bold' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    })
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'No Winner!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            line={line}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggle()}>change order</button>
          <ol>{this.state.ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      }
    }
  }
  return null;
}
