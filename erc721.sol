// ERC20
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract CookingVideoNFT is ERC20 {
//     constructor() ERC20("CookingVideoNFT", "CVT"){
//         _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
//     }

// }

// ERC721
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// contract MyNFT is ERC721URIStorage {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;

//     constructor() ERC721("CookingVideoNFT", "CVT") {}

//     function mintNFT(
//         address recipient,
//         string memory tokenURI
//     ) public returns (uint256) {
//         _tokenIds.increment();

//         uint256 newItemId = _tokenIds.current();
//         _mint(recipient, newItemId);
//         _setTokenURI(newItemId, tokenURI);

//         return newItemId;
//     }
// }

// // ERC1155
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "ERC20.sol";
// import "ERC721.sol";

// contract CookingVideoNFT {
//     cvt private _cvt;
//     MyNFT private _myNFT;

//     constructor(address cvtAddress, address myNFTAddress) {
//         _cvt = cvt(cvtAddress);
//         _myNFT = MyNFT(myNFTAddress);
//     }

//     function buyVideo(uint256 cvtAmount, string memory tokenURI) public {
//         // Transfer CVT from user to contract
//         _cvt.transferFrom(msg.sender, address(this), cvtAmount);

//         // Mint NFT to user
//         _myNFT.mintNFT(msg.sender, tokenURI);
//     }
// }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CVT20 is ERC20, Ownable {
    // Mapping from content creator to their CVNFT Shares balance
    mapping(address => uint256) private _creatorShares;

    // Event that logs the minting of new CVNFT Shares
    event CVNFTSharesMinted(address indexed creator, uint256 amount);

    constructor() ERC20("Cooking Video Token", "CVT") {
        // Initial setup can be done here if required
        _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
    }

    /**
     * @dev Function to mint CVNFT Shares.
     * @param creator The address of the content creator receiving the shares.
     * @param amount The amount of shares to mint.
     */
    function mintCVNFTShares(address creator, uint256 amount) public onlyOwner {
        require(
            creator != address(0),
            "CVT20: cannot mint to the zero address"
        );
        require(amount > 0, "CVT20: amount must be greater than zero");

        _mint(creator, amount);
        _creatorShares[creator] += amount;

        emit CVNFTSharesMinted(creator, amount);
    }

    /**
     * @dev Function to get the balance of CVNFT Shares of a content creator.
     * @param creator The address of the content creator.
     * @return The balance of CVNFT Shares.
     */
    function creatorSharesBalance(
        address creator
    ) public view returns (uint256) {
        return _creatorShares[creator];
    }

    // Override `_beforeTokenTransfer` if needed to add restrictions on transfers

    // ... (Additional functions as needed)
}
