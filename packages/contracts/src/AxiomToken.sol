// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AxiomToken (AXID) - Human Continuity Asset (HCA)
 * @dev Implements the Human Continuity & Identity Value Protocol.
 * The token represents a cryptographic relationship between the owner, 
 * their continuity field, trust history, and participation.
 */
contract AxiomToken is ERC20, Ownable {
    
    struct ContinuityField {
        string formula;           // High-dimensional mathematical representation
        uint256 createdAt;        // Proof of existence start
        uint256 lastEvolution;    // Last time the genome evolved
        uint256 continuityScore;  // Proof of persistence
        uint256 trustScore;       // Accumulated trust signals
        uint256 contributionScore;// Participation & value creation
        bool active;
    }

    mapping(address => ContinuityField) public identityFields;
    mapping(string => address) private _formulaToOwner;

    event IdentityEvolved(address indexed user, uint256 newScore, string dimension);
    event ContinuityVerified(address indexed user, uint256 timestamp);

    constructor() ERC20("Axiom Human Continuity", "AXID") Ownable(msg.sender) {}

    /**
     * @dev Establishes the Foundation Layer of the Human Digital Genome.
     */
    function establishFoundation(string calldata formula) external {
        require(!identityFields[msg.sender].active, "Identity already established");
        require(_formulaToOwner[formula] == address(0), "Formula already claimed");

        identityFields[msg.sender] = ContinuityField({
            formula: formula,
            createdAt: block.timestamp,
            lastEvolution: block.timestamp,
            continuityScore: 100, // Initial existence score
            trustScore: 0,
            contributionScore: 0,
            active: true
        });

        _formulaToOwner[formula] = msg.sender;
        
        // Initial minting of the Human Continuity Asset (HCA)
        _mint(msg.sender, 100 * 10**decimals());
    }

    /**
     * @dev Evolves the identity based on verified signals (Behavioral, Trust, Contribution).
     * This function would be called by authorized validators or automated protocols.
     */
    function evolveIdentity(
        address user, 
        uint256 scoreIncrease, 
        string calldata dimension
    ) external onlyOwner {
        require(identityFields[user].active, "Identity not active");
        
        ContinuityField storage field = identityFields[user];
        
        if (keccak256(bytes(dimension)) == keccak256(bytes("trust"))) {
            field.trustScore += scoreIncrease;
        } else if (keccak256(bytes(dimension)) == keccak256(bytes("contribution"))) {
            field.contributionScore += scoreIncrease;
        }
        
        field.lastEvolution = block.timestamp;
        
        // Minting additional HCA based on evolution
        _mint(user, scoreIncrease * 10**decimals());
        
        emit IdentityEvolved(user, scoreIncrease, dimension);
    }

    /**
     * @dev Verifies and strengthens the Continuity Signal over time.
     */
    function verifyContinuity(address user) external onlyOwner {
        require(identityFields[user].active, "Identity not active");
        
        ContinuityField storage field = identityFields[user];
        uint256 timePassed = block.timestamp - field.lastEvolution;
        
        // Continuity score increases with time and persistent existence
        uint256 continuityBonus = timePassed / 1 days; 
        field.continuityScore += continuityBonus;
        field.lastEvolution = block.timestamp;
        
        _mint(user, continuityBonus * 10**decimals());
        
        emit ContinuityVerified(user, block.timestamp);
    }

    /**
     * @dev Non-transferable core identity logic.
     * While HCA tokens can be traded, the core identity field remains bound to the owner.
     */
    function _update(address from, address to, uint256 value) internal override {
        // Implementation of transfer logic for the Human Continuity Asset.
        // In some configurations, AXID might be soulbound or restricted.
        super._update(from, to, value);
    }

    /**
     * @dev Returns the total Human Continuity Score.
     */
    function getGlobalScore(address user) external view returns (uint256) {
        ContinuityField memory field = identityFields[user];
        return field.continuityScore + field.trustScore + field.contributionScore;
    }
}
