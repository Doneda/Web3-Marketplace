// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    IERC20 public token;
    
    struct Item {
        uint256 id;
        address seller;
        string name;
        string description;
        uint256 price;
        bool available;
    }
    
    mapping(uint256 => Item) public items;
    uint256 public itemCount;
    
    event ItemListed(uint256 indexed id, address indexed seller, string name, uint256 price);
    event ItemSold(uint256 indexed id, address indexed buyer, address indexed seller, uint256 price);
    event ItemDelisted(uint256 indexed id, address indexed seller);
    
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }
    
    function listItem(string memory _name, string memory _description, uint256 _price) public {
        require(_price > 0, "Price must be greater than 0");
        
        itemCount++;
        items[itemCount] = Item(itemCount, msg.sender, _name, _description, _price, true);
        
        emit ItemListed(itemCount, msg.sender, _name, _price);
    }
    
    function buyItem(uint256 _itemId) public nonReentrant {
        Item storage item = items[_itemId];
        
        require(item.available, "Item not available");
        require(item.seller != msg.sender, "Cannot buy your own item");
        
        // Transfer tokens from buyer to seller
        require(token.transferFrom(msg.sender, item.seller, item.price), "Payment failed");
        
        item.available = false;
        
        emit ItemSold(_itemId, msg.sender, item.seller, item.price);
    }
    
    function delistItem(uint256 _itemId) public {
        Item storage item = items[_itemId];
        
        require(item.seller == msg.sender, "Only seller can delist");
        require(item.available, "Item already sold");
        
        item.available = false;
        
        emit ItemDelisted(_itemId, msg.sender);
    }
    
    function getItem(uint256 _itemId) public view returns (Item memory) {
        return items[_itemId];
    }
}