// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AxiomRouter is Ownable {
    constructor() Ownable(msg.sender) {}

    event SwapExecuted(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        string exchange
    );

    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        string calldata exchange
    ) external returns (uint256) {
        // Logic for interacting with DEXs (Uniswap, Pancake, etc.)
        // This is a simplified proxy router
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Placeholder for actual swap logic
        uint256 amountOut = amountIn; // Mock 1:1 for now
        require(amountOut >= minAmountOut, "Slippage too high");
        
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut, exchange);
        return amountOut;
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
