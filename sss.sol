// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract CookingVideoNFT is ERC1155 {
    uint256 public constant cookingVideo = 0;
    uint256 public constant recipe = 1;
    uint256 public constant ingredient = 2;

    constructor() ERC1155("uri") {
        _mint(msg.sender, cookingVideo, 100000000, "");
        _mint(msg.sender, recipe, 100000000, "");
        _mint(msg.sender, ingredient, 100000000, "");
    }

    // map user to videos[]

    struct UserVideos {
        address user;
        uint256[] videos;
    }

    struct VideoOwner {
        uint256 videoId;
        address currentOwner;
        uint256 price;
        uint256 bidAmount;
        address[] prevOwner;
        bool forSale;
    }

    struct Videooffers {
        uint256 videoId;
        string offerID;
        address offerer;
        uint256 amount;
        bool accepted;
    }

    // royalities
    struct RoyalitiesforVideo {
        uint256 videoId;
        uint256 royalities;
        address royalitiesOwner;
    }

    uint256[] public _allVideos;
    mapping(uint256 => VideoOwner) public _videoOwners;
    mapping(uint256 => address[]) public _videoPrevOwners;
    mapping(uint256 => bool) public _videoExist;
    mapping(address => UserVideos) public _userVideos;
    mapping(uint256 => RoyalitiesforVideo) public _royalitiesforVideo;
    mapping(address => bool) public _royalitiesOwner;
    mapping(address => bool) public _royalitiesOwnerExist;
    mapping(uint256 => bool) public _royalitiesExist;
    mapping(uint256 => bool) public _forSale;
    mapping(uint256 => Videooffers[]) public _videoOffers;

    // events
    event VideoMinted(
        uint256 videoId,
        address videoOwner,
        address[] prevOwners
    );
    event RoyalitiesMinted(
        uint256 videoId,
        uint256 royalities,
        address royalitiesOwner
    );
    event TransferVideo(uint256 videoId, address from, address to);
    event TransferRoyalities(uint256 videoId, address from, address to);
    event SetForSale(uint256 videoID, bool forSale);
    event BuyCVNFT(uint256 videoID, address buyer, uint256 amount);
    event SetRoyaltyPercentage(uint256 royaltyPercentage);

    // modifiers
    modifier onlyVideoOwner(uint256 _videoId) {
        require(
            _videoOwners[_videoId].currentOwner == msg.sender,
            "You are not the owner of this video"
        );
        _;
    }

    // minting video
    function mintVideo(
        uint256 _videoId,
        uint256 _price,
        uint256 _royalities
    ) public {
        require(!_videoExist[_videoId], "Video already exist");
        require(_price > 0, "Price must be greater than zero");
        require(_royalities > 0, "royalities must be greater than zero");

        _mint(msg.sender, _videoId, 1, "");
        _videoOwners[_videoId].videoId = _videoId;
        _videoOwners[_videoId].currentOwner = msg.sender;
        _videoOwners[_videoId].price = _price;
        _videoOwners[_videoId].forSale = false;
        _videoOwners[_videoId].prevOwner.push(msg.sender);
        _videoOwners[_videoId].bidAmount = 0;
        _videoPrevOwners[_videoId].push(msg.sender);
        _videoExist[_videoId] = true;
        _allVideos.push(_videoId);
        _royalitiesforVideo[_videoId].royalities = _royalities;
        _royalitiesforVideo[_videoId].royalitiesOwner = msg.sender;
        _royalitiesforVideo[_videoId].videoId = _videoId;
        _royalitiesExist[_videoId] = true;
        _royalitiesOwnerExist[msg.sender] = true;
        _forSale[_videoId] = false;
        _userVideos[msg.sender].videos.push(_videoId);
        _userVideos[msg.sender].user = msg.sender;

        emit VideoMinted(_videoId, msg.sender, _videoPrevOwners[_videoId]);
        emit RoyalitiesMinted(_videoId, _royalities, msg.sender);
    }

    // for sale
    function setVideoForSale(uint256 _videoId, uint256 _price) public {
        require(
            _videoOwners[_videoId].currentOwner == msg.sender,
            "You are not the owner of this video"
        );

        _videoOwners[_videoId].forSale = true;
        _videoOwners[_videoId].bidAmount = _price;
        _forSale[_videoId] = true;
    }

    // not for sale
    function setVideoForNotSale(uint256 _videoId) public {
        require(
            _videoOwners[_videoId].currentOwner == msg.sender,
            "You are not the owner of this video"
        );

        _videoOwners[_videoId].forSale = false;
        _videoOwners[_videoId].bidAmount = 0;
        _forSale[_videoId] = false;
    }

    // buy video from owner and transfer royalities to royalities owner and transfer to prev owner
    function buyVideo(uint256 _videoId) public {
        require(_videoExist[_videoId], "Video does not exist");
        require(_forSale[_videoId], "Video is not for sale");
        require(
            _royalitiesOwnerExist[
                _royalitiesforVideo[_videoId].royalitiesOwner
            ],
            "Royalities does not exist"
        );
        require(
            _royalitiesExist[_videoId],
            "Royalities for this video does not exist"
        );
        // require(
        //     msg.value >= _videoOwners[_videoId].bidAmount,
        //     "Not enough money to buy this video"
        // );

        // uint256 _royalities = (_videoOwners[_videoId].bidAmount *
        //     _royalitiesforVideo[_videoId].royalities) / 100;
        // uint256 _ownerAmount = _videoOwners[_videoId].bidAmount - _royalities;

        // transfer royalities to royalities owner
        // payable(_royalitiesforVideo[_videoId].royalitiesOwner).transfer(
        //     _royalities
        // );

        // transfer to prev owner
        uint256 _prevOwnerLength = _videoPrevOwners[_videoId].length;
        for (uint256 i = 0; i < _prevOwnerLength; i++) {
            // payable(_videoPrevOwners[_videoId][i]).transfer(_ownerAmount);
        }

        // transfer video to new owner
        // safeTransferFrom(
        //     msg.sender,
        //     _videoOwners[_videoId].currentOwner,
        //     _videoId,
        //     1,
        //     ""
        // );

        // update video owner
        _videoOwners[_videoId].currentOwner = msg.sender;
        _videoPrevOwners[_videoId].push(msg.sender);
        _videoOwners[_videoId].forSale = false;

        _forSale[_videoId] = false;

        // emit TransferVideo(
        //     _videoId,
        //     msg.sender,
        //     _videoOwners[_videoId].prevOwner
        // );
        emit TransferRoyalities(
            _videoId,
            msg.sender,
            _royalitiesforVideo[_videoId].royalitiesOwner
        );
    }

    function offerVideo(
        uint256 _videoId,
        uint256 _amount,
        string memory _offerID
    ) public {
        require(
            _videoOwners[_videoId].currentOwner != msg.sender,
            "You are the owner of this video"
        );
        require(
            _videoOwners[_videoId].forSale == true,
            "Video is not for sale"
        );
        require(
            _videoOwners[_videoId].bidAmount > _amount,
            "Your amount is less than bid amount"
        );

        Videooffers memory _offer = Videooffers({
            videoId: _videoId,
            offerID: _offerID,
            offerer: msg.sender,
            amount: _amount,
            accepted: false
        });

        _videoOffers[_videoId].push(_offer);
    }

    function getVideoOffers(
        uint256 _videoId
    ) public view returns (Videooffers[] memory) {
        return _videoOffers[_videoId];
    }

    // accept video offer
    function acceptVideoOffer(
        uint256 _videoId,
        string memory _offerID
    ) public onlyVideoOwner(_videoId) {
        uint256 _offersLength = _videoOffers[_videoId].length;
        bool _offerExist = false;
        uint256 _offerIndex;

        for (uint256 i = 0; i < _offersLength; i++) {
            if (
                keccak256(
                    abi.encodePacked(_videoOffers[_videoId][i].offerID)
                ) == keccak256(abi.encodePacked(_offerID))
            ) {
                _offerExist = true;
                _offerIndex = i;
            }
        }

        require(_offerExist, "Offer does not exist");
        require(
            _videoOwners[_videoId].bidAmount >
                _videoOffers[_videoId][_offerIndex].amount,
            "Offer amount is less than bid amount"
        );

        // address payable _prevOwner = payable(
        //     _videoOwners[_videoId].currentOwner
        // );
        // _prevOwner.transfer(_videoOffers[_videoId][_offerIndex].amount);

        _videoOwners[_videoId].prevOwner.push(
            _videoOwners[_videoId].currentOwner
        );
        _videoOwners[_videoId].currentOwner = _videoOffers[_videoId][
            _offerIndex
        ].offerer;
        _videoOwners[_videoId].forSale = false;
        _videoOwners[_videoId].bidAmount = _videoOffers[_videoId][_offerIndex]
            .amount;
        _videoOwners[_videoId].prevOwner.push(
            _videoOwners[_videoId].currentOwner
        );

        _videoOffers[_videoId][_offerIndex].accepted = true;
    }

    // get user videos
    // function getUserVideos(
    //     address user
    // ) public view returns (uint256[] memory) {
    //     return _userVideos[user];
    // }

    // get all videos
    function getAllVideos() public view returns (uint256[] memory) {
        return _allVideos;
    }

    // get video owner
    function getVideoOwner(
        uint256 videoID
    ) public view returns (address, bool) {
        return (
            _videoOwners[videoID].currentOwner,
            _videoOwners[videoID].forSale
        );
    }

    // // get video royalities
    // function getVideoRoyalities(
    //     uint256 videoID
    // ) public view returns (uint256, address) {
    //     return (
    //         _royalitiesforVideo[videoID].royalties,
    //         _royalitiesforVideo[videoID].royaltiesOwner
    //     );
    // }

    // get video prev owners
    function getVideoPrevOwner(
        uint256 videoID
    ) public view returns (address[] memory) {
        return _videoPrevOwners[videoID];
    }

    // get video price
    function getVideoPrice(uint256 videoID) public view returns (uint256) {
        return _videoOwners[videoID].price;
    }

    function getVideoBidAmount(uint256 videoID) public view returns (uint256) {
        return _videoOwners[videoID].bidAmount;
    }

    // get video for sale
    function getVideoForSale(uint256 videoID) public view returns (bool) {
        return _videoOwners[videoID].forSale;
    }

    // get video exist
    function getVideoExist(uint256 videoID) public view returns (bool) {
        return _videoExist[videoID];
    }

    // get user videos
    // function getUserVideos(
    //     address user
    // ) public view returns (uint256[] memory) {
    //     return _userVideos[user].videos;
    // }

    // mint video
    // function mintVideo(uint256 videoID, uint256 price) public {
    //     require(!_videoExist[videoID], "Video already exists");

    //     _videoOwners[videoID] = VideoOwner({
    //         videoId: videoID,
    //         currentOwner: msg.sender,
    //         price: price,
    //         prevOwner: new address[](0),
    //         forSale: false
    //     });

    //     _videoExist[videoID] = true;
    //     _allVideos.push(videoID);
    //     _userVideos[msg.sender].videos.push(videoID);

    //     emit VideoMinted(videoID, msg.sender, new address[](0));
    // }

    // transfer video ownership
    function transferVideoOwnership(
        uint256 videoID,
        address newOwner
    ) public onlyVideoOwner(videoID) {
        require(newOwner != address(0), "Invalid recipient");

        _videoOwners[videoID].prevOwner.push(msg.sender);
        // _safeTransferFrom(msg.sender, newOwner, videoID, 1, "");

        _videoOwners[videoID].currentOwner = newOwner;

        emit TransferVideo(videoID, msg.sender, newOwner);
    }

    // set video for sale
    // function setVideoForSale(
    //     uint256 videoID,
    //     bool forSale
    // ) public onlyVideoOwner(videoID) {
    //     _videoOwners[videoID].forSale = forSale;

    //     emit SetForSale(videoID, forSale);
    // }

    // buy video
    // function buyVideo(uint256 videoID) public payable {
    //     require(_videoOwners[videoID].forSale, "Video is not for sale");
    //     require(
    //         msg.value == _videoOwners[videoID].price,
    //         "Incorrect payment amount"
    //     );

    //     address payable seller = payable(_videoOwners[videoID].currentOwner);
    //     seller.transfer(msg.value);

    //     _videoOwners[videoID].prevOwner.push(
    //         _videoOwners[videoID].currentOwner
    //     );
    //     _safeTransferFrom(
    //         _videoOwners[videoID].currentOwner,
    //         msg.sender,
    //         videoID,
    //         1,
    //         ""
    //     );

    //     _videoOwners[videoID].currentOwner = msg.sender;
    //     _videoOwners[videoID].forSale = false;

    //     _userVideos[seller].videos.remove(videoID);
    //     _userVideos[msg.sender].videos.push(videoID);

    //     emit BuyCVNFT(videoID, msg.sender, msg.value);
    //     emit TransferVideo(videoID, seller, msg.sender);
    // }

    // set royalities percentage
    function setRoyaltyPercentage(uint256 royaltyPercentage) public {
        require(royaltyPercentage <= 100, "Invalid royalty percentage");

        royaltyPercentage = royaltyPercentage;

        emit SetRoyaltyPercentage(royaltyPercentage);
    }

    // mint royalities for video
    function mintRoyalitiesForVideo(
        uint256 videoID,
        uint256 royalities,
        address royalitiesOwner
    ) public {
        require(_videoExist[videoID], "Video does not exist");
        require(royalitiesOwner != address(0), "Invalid royalities owner");
        require(
            !_royalitiesExist[videoID],
            "Royalities already minted for this video"
        );

        _royalitiesforVideo[videoID] = RoyalitiesforVideo({
            videoId: videoID,
            royalities: royalities,
            royalitiesOwner: royalitiesOwner
        });

        _royalitiesExist[videoID] = true;

        if (!_royalitiesOwnerExist[royalitiesOwner]) {
            _royalitiesOwnerExist[royalitiesOwner] = true;
            _royalitiesOwner[royalitiesOwner] = true;
            _mint(royalitiesOwner, 0, 1, "");
        }

        emit RoyalitiesMinted(videoID, royalities, royalitiesOwner);
    }

    // transfer royalities ownership
    function transferRoyalitiesOwnership(
        uint256 videoID,
        address newOwner
    ) public {
        require(newOwner != address(0), "Invalid recipient");

        // _safeTransferFrom(
        //     _royalitiesforVideo[videoID].royalitiesOwner,
        //     newOwner,
        //     0,
        //     1,
        //     ""
        // );

        _royalitiesforVideo[videoID].royalitiesOwner = newOwner;

        emit TransferRoyalities(videoID, msg.sender, newOwner);
    }

    function getMyVideos() public view returns (uint256[] memory) {
        return _userVideos[msg.sender].videos;
    }

    function getVideoDetails(
        uint256 videoID
    )
        public
        view
        returns (address, uint256, uint256, address[] memory, bool, uint256)
    {
        return (
            _videoOwners[videoID].currentOwner,
            _videoOwners[videoID].price,
            _videoOwners[videoID].bidAmount,
            _videoOwners[videoID].prevOwner,
            _videoOwners[videoID].forSale,
            _videoOwners[videoID].videoId
        );
    }

    // show balance
    function showBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // add balance
    function addBalance(uint256 amount) public payable {
        require(amount <= address(this).balance, "Not enough balance");

        address payable sender = payable(msg.sender);
        sender.transfer(amount);
    }

    // mint function
    function mint(uint256 id, uint256 amount) public {
        _mint(msg.sender, id, amount, "");
    }
}
