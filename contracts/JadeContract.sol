// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract JadeContract {
    enum JadeStatus {Sold, Available}
    
    string public companyName;
    uint jadeCount;

    // Constructor code is only run when the contract is created
    constructor() {
        jadeCount=0;
        companyName = "Jade Veritas";
    }

    //declare the structure of the jade data
   struct JadeInformation {
        string id;
        string name;
        string minedDate;
        string origin;
        string dimensions;
        string color;
        string translucency;
        uint price;
        JadeStatus status;
    }

    //declare the structure for the owner data
    struct OwnershipRecord {
        address payable ownerId;
        string ownerName;
        string transferDate;
        string phone;
        string email;  
    } 

    // declare the structure for the certification record
    struct CertificateRecord {
        string certificationId;
        string grade;
        string issueDate;
        string authorityName;
    }

    // declare the structure of the provenance record
    struct ProvenanceRecord {
        string handlerName;
        string handlerAddress;
        string transferDate;
    }

    //declare the structure for the jade information - 
    //which consists of jadeInfo, ownership, certification and ProvenanceRecord
    struct Jade {
        JadeInformation jadeInfo;
        OwnershipRecord[] ownershipRecords;
        CertificateRecord[] certificateHistory;
        ProvenanceRecord[] provenanceHistory;
    }
    //map the jade id to the Jade structure and hold them in the mapping variable jades
    mapping(uint256 => Jade) public jades;

    //write the getter functions
    // function to get the company name getCompanyName() 
    function getCompanyName() public view returns(string memory){
        return companyName;
    }

    //Write a function getNoOfJades to obtain the jadeCount
    function getNoOfJades() public view returns (uint) {
        return jadeCount;
    }

     // Function to retrieve jade  information
    function getJadeInfo(uint256 jadeId) public view returns (JadeInformation memory) {
        return jades[jadeId].jadeInfo;
    }

     // Function to retrieve ownership records
    function getOwnershipRecords(uint256 jadeId) public view returns (OwnershipRecord[] memory) {
        return jades[jadeId].ownershipRecords;
    }

    // Function to retrieve certification records
    function getCertificateRecords(uint256 jadeId) public view returns (CertificateRecord[] memory) {
        return jades[jadeId].certificateHistory;
    }

    // Function to retrieve provenance records
    function getProvenanceRecords(uint256 jadeId) public view returns (ProvenanceRecord[] memory) {
        return jades[jadeId].provenanceHistory;
    }

    //function to register the jade
    function registerJade() public returns (uint256) {
        jadeCount++;    
        return jadeCount;
    }

    //create the event
    event JadeCreated(
        uint256 jadeId,
        string id,
        string name,
        string minedDate,
        string origin,
        string dimensions,
        string color,
        string translucency
    );

    // Function to add jade  information
    function addJadeInfo(
        uint256 jadeId,
        string memory _id,
        string memory _name,
        string memory _minedDate,
        string memory _origin,
        string memory _dimensions,
        string memory _color,
        string memory _translucency,
        uint price
    ) public {
        jades[jadeId].jadeInfo = JadeInformation(_id, _name, _minedDate, _origin, _dimensions, _color, _translucency, price, JadeStatus.Available);
        emit JadeCreated(jadeId, _id, _name, _minedDate, _origin, _dimensions, _color, _translucency);
    }

    //create the event
    event OwnerCreated(
        uint256 jadeId,
        string ownerName,
        string transferDate,
        string phone,
        string email
    );

    // Function to add a new ownership record
    function addOwnerShipRecord (uint256 jadeId, 
        string memory _ownerName,
        string memory _transferDate,
        string memory _phone,
        string memory _email ) public {
            jades[jadeId].ownershipRecords.push(OwnershipRecord(payable(msg.sender), _ownerName, _transferDate, _phone, _email));
           emit OwnerCreated (jadeId, _ownerName, _transferDate, _phone, _email);
    }
    //create the event
    event CertificateRecCreated(
        uint256 jadeId,
        string certificationId,
        string grade,
        string issueDate,
        string authorityName
    );

    function addCertificateRecord (uint256 jadeId, 
        string memory _certificationId,
        string memory _grade,
        string memory _issueDate,
        string memory _authorityName
        ) public {
            jades[jadeId].certificateHistory.push(CertificateRecord(_certificationId, _grade, _issueDate, _authorityName));
            emit CertificateRecCreated(jadeId, _certificationId, _grade, _issueDate, _authorityName);
    }

    //create the event
    event ProvenanceRecCreated(
            uint256 jadeId,
            string handlerName,
            string handlerAddress,
            string transferDate
    );

    function addProvenanceRecord (uint256 jadeId, 
         string memory _handlerName,
        string memory _handlerAddress,
        string memory _transferDate
        ) public {
            jades[jadeId].provenanceHistory.push(ProvenanceRecord(_handlerName, _handlerAddress, _transferDate));
        emit ProvenanceRecCreated(jadeId, _handlerName, _handlerAddress, _transferDate);
    }

    //create the event to purchase the Jade
    event JadePurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        JadeStatus status
    );

    //add a function to purchase jade with the jade id
    function purchaseJade(uint _id) public payable {
        // Fetch the product (jade information) from the contract's storage
        Jade memory jadeData = jades[_id];
        
        // Fetch the owner
        uint256 curOwnerId = jadeData.ownershipRecords.length;
        address payable seller = jadeData.ownershipRecords[curOwnerId-1].ownerId;

        // Make sure the product has a valid id and that it exists
        require(jadeCount > 0 && bytes(jadeData.jadeInfo.id).length != 0, "Jade Id cannot be empty" );

        // Require that there is enough Ether in the transaction from buyer
        require(msg.value >= jadeData.jadeInfo.price);

        // Require that the product has not been purchased already
        require(jadeData.jadeInfo.status == JadeStatus.Available);

        // Require that the buyer is not the seller
        require(seller != msg.sender);

        // Transfer ownership to the buyer
        //jadeData.ownershipRecords[curOwnerId ++].ownerId = payable(msg.sender);

        // Mark as purchased
        jadeData.jadeInfo.status = JadeStatus.Sold;

        // Update the jade information
        jades[_id].jadeInfo = jadeData.jadeInfo;

        // Pay the seller by sending them Ether
        payable(seller).transfer(msg.value);
        
        // Trigger an event
        emit JadePurchased(jadeCount, jadeData.jadeInfo.name, jadeData.jadeInfo.price, payable(msg.sender), JadeStatus.Sold);
    }

  
}
