"""
Knowledge Graph module for the Creation AI Ecosystem.
Provides functionality for creating and managing knowledge graphs.
"""

from typing import Dict, List, Optional, Any, Set, Tuple
import uuid
from datetime import datetime
import networkx as nx


class KnowledgeGraph:
    """
    Class for managing knowledge graphs in the Creation AI Ecosystem.
    Provides functionality for creating, querying, and manipulating knowledge graphs.
    """
    
    def __init__(self):
        """
        Initialize a new knowledge graph instance.
        """
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata = {}
        
        # Initialize the graph using NetworkX
        self.graph = nx.DiGraph()
    
    def add_node(self, node_id: str, node_data: Dict[str, Any]) -> None:
        """
        Add a node to the knowledge graph.
        
        Args:
            node_id: The ID of the node
            node_data: The node data
        """
        self.graph.add_node(node_id, **node_data)
        self.updated_at = datetime.now()
    
    def update_node(self, node_id: str, node_data: Dict[str, Any]) -> bool:
        """
        Update a node in the knowledge graph.
        
        Args:
            node_id: The ID of the node
            node_data: The updated node data
            
        Returns:
            bool: True if the node was updated, False if it wasn't found
        """
        if node_id in self.graph.nodes:
            # Update node attributes
            for key, value in node_data.items():
                self.graph.nodes[node_id][key] = value
            
            self.updated_at = datetime.now()
            return True
        return False
    
    def remove_node(self, node_id: str) -> bool:
        """
        Remove a node from the knowledge graph.
        
        Args:
            node_id: The ID of the node to remove
            
        Returns:
            bool: True if the node was removed, False if it wasn't found
        """
        if node_id in self.graph.nodes:
            self.graph.remove_node(node_id)
            self.updated_at = datetime.now()
            return True
        return False
    
    def get_node(self, node_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a node from the knowledge graph.
        
        Args:
            node_id: The ID of the node to retrieve
            
        Returns:
            Optional[Dict]: The node data, or None if not found
        """
        if node_id in self.graph.nodes:
            return dict(self.graph.nodes[node_id])
        return None
    
    def add_edge(self, source_id: str, target_id: str, edge_data: Dict[str, Any] = None) -> bool:
        """
        Add an edge between two nodes in the knowledge graph.
        
        Args:
            source_id: The ID of the source node
            target_id: The ID of the target node
            edge_data: Optional data for the edge
            
        Returns:
            bool: True if the edge was added, False if either node wasn't found
        """
        if source_id in self.graph.nodes and target_id in self.graph.nodes:
            if edge_data:
                self.graph.add_edge(source_id, target_id, **edge_data)
            else:
                self.graph.add_edge(source_id, target_id)
            
            self.updated_at = datetime.now()
            return True
        return False
    
    def update_edge(self, source_id: str, target_id: str, edge_data: Dict[str, Any]) -> bool:
        """
        Update an edge in the knowledge graph.
        
        Args:
            source_id: The ID of the source node
            target_id: The ID of the target node
            edge_data: The updated edge data
            
        Returns:
            bool: True if the edge was updated, False if it wasn't found
        """
        if self.graph.has_edge(source_id, target_id):
            # Update edge attributes
            for key, value in edge_data.items():
                self.graph[source_id][target_id][key] = value
            
            self.updated_at = datetime.now()
            return True
        return False
    
    def remove_edge(self, source_id: str, target_id: str) -> bool:
        """
        Remove an edge from the knowledge graph.
        
        Args:
            source_id: The ID of the source node
            target_id: The ID of the target node
            
        Returns:
            bool: True if the edge was removed, False if it wasn't found
        """
        if self.graph.has_edge(source_id, target_id):
            self.graph.remove_edge(source_id, target_id)
            self.updated_at = datetime.now()
            return True
        return False
    
    def get_edge(self, source_id: str, target_id: str) -> Optional[Dict[str, Any]]:
        """
        Get an edge from the knowledge graph.
        
        Args:
            source_id: The ID of the source node
            target_id: The ID of the target node
            
        Returns:
            Optional[Dict]: The edge data, or None if not found
        """
        if self.graph.has_edge(source_id, target_id):
            return dict(self.graph[source_id][target_id])
        return None
    
    def get_neighbors(self, node_id: str) -> List[str]:
        """
        Get the neighbors of a node in the knowledge graph.
        
        Args:
            node_id: The ID of the node
            
        Returns:
            List[str]: A list of neighbor node IDs
        """
        if node_id in self.graph.nodes:
            return list(self.graph.neighbors(node_id))
        return []
    
    def get_predecessors(self, node_id: str) -> List[str]:
        """
        Get the predecessors of a node in the knowledge graph.
        
        Args:
            node_id: The ID of the node
            
        Returns:
            List[str]: A list of predecessor node IDs
        """
        if node_id in self.graph.nodes:
            return list(self.graph.predecessors(node_id))
        return []
    
    def get_shortest_path(self, source_id: str, target_id: str) -> List[str]:
        """
        Get the shortest path between two nodes in the knowledge graph.
        
        Args:
            source_id: The ID of the source node
            target_id: The ID of the target node
            
        Returns:
            List[str]: A list of node IDs representing the shortest path, or an empty list if no path exists
        """
        try:
            return nx.shortest_path(self.graph, source_id, target_id)
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []
    
    def search_nodes(self, query: Dict[str, Any]) -> List[str]:
        """
        Search for nodes in the knowledge graph based on attributes.
        
        Args:
            query: Dictionary of attribute key-value pairs to match
            
        Returns:
            List[str]: A list of matching node IDs
        """
        matching_nodes = []
        
        for node_id, node_data in self.graph.nodes(data=True):
            matches = True
            for key, value in query.items():
                if key not in node_data or node_data[key] != value:
                    matches = False
                    break
            
            if matches:
                matching_nodes.append(node_id)
        
        return matching_nodes
    
    def get_subgraph(self, node_ids: List[str]) -> 'KnowledgeGraph':
        """
        Create a subgraph containing only the specified nodes and their edges.
        
        Args:
            node_ids: List of node IDs to include in the subgraph
            
        Returns:
            KnowledgeGraph: A new knowledge graph instance containing the subgraph
        """
        # Create a new knowledge graph
        subgraph = KnowledgeGraph()
        
        # Get the NetworkX subgraph
        nx_subgraph = self.graph.subgraph(node_ids)
        
        # Copy nodes and edges to the new knowledge graph
        for node_id, node_data in nx_subgraph.nodes(data=True):
            subgraph.add_node(node_id, dict(node_data))
        
        for source_id, target_id, edge_data in nx_subgraph.edges(data=True):
            subgraph.add_edge(source_id, target_id, dict(edge_data))
        
        return subgraph
    
    def merge(self, other_graph: 'KnowledgeGraph') -> None:
        """
        Merge another knowledge graph into this one.
        
        Args:
            other_graph: The knowledge graph to merge
        """
        # Merge nodes
        for node_id, node_data in other_graph.graph.nodes(data=True):
            if node_id in self.graph.nodes:
                # Update existing node
                self.update_node(node_id, dict(node_data))
            else:
                # Add new node
                self.add_node(node_id, dict(node_data))
        
        # Merge edges
        for source_id, target_id, edge_data in other_graph.graph.edges(data=True):
            if self.graph.has_edge(source_id, target_id):
                # Update existing edge
                self.update_edge(source_id, target_id, dict(edge_data))
            else:
                # Add new edge if both nodes exist
                if source_id in self.graph.nodes and target_id in self.graph.nodes:
                    self.add_edge(source_id, target_id, dict(edge_data))
        
        self.updated_at = datetime.now()
    
    def add_metadata(self, key: str, value: Any) -> None:
        """
        Add metadata to the knowledge graph.
        
        Args:
            key: The metadata key
            value: The metadata value
        """
        self.metadata[key] = value
        self.updated_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the knowledge graph to a dictionary representation.
        
        Returns:
            Dict: A dictionary representation of the knowledge graph
        """
        # Convert nodes to dictionary
        nodes = {}
        for node_id, node_data in self.graph.nodes(data=True):
            nodes[node_id] = dict(node_data)
        
        # Convert edges to dictionary
        edges = {}
        for source_id, target_id, edge_data in self.graph.edges(data=True):
            if source_id not in edges:
                edges[source_id] = {}
            edges[source_id][target_id] = dict(edge_data)
        
        return {
            "id": self.id,
            "nodes": nodes,
            "edges": edges,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'KnowledgeGraph':
        """
        Create a knowledge graph from a dictionary representation.
        
        Args:
            data: Dictionary containing knowledge graph data
            
        Returns:
            KnowledgeGraph: A new knowledge graph instance
        """
        graph = cls()
        
        # Set ID and timestamps
        graph.id = data.get("id", graph.id)
        
        if data.get("created_at"):
            graph.created_at = datetime.fromisoformat(data["created_at"])
        
        if data.get("updated_at"):
            graph.updated_at = datetime.fromisoformat(data["updated_at"])
        
        # Add nodes
        for node_id, node_data in data.get("nodes", {}).items():
            graph.add_node(node_id, node_data)
        
        # Add edges
        for source_id, targets in data.get("edges", {}).items():
            for target_id, edge_data in targets.items():
                graph.add_edge(source_id, target_id, edge_data)
        
        # Set metadata
        graph.metadata = data.get("metadata", {})
        
        return graph
    
    def __str__(self) -> str:
        """
        String representation of the knowledge graph.
        
        Returns:
            str: A string representation of the knowledge graph
        """
        return f"KnowledgeGraph(nodes={len(self.graph.nodes)}, edges={len(self.graph.edges)})"
    
    def __repr__(self) -> str:
        """
        Detailed string representation of the knowledge graph.
        
        Returns:
            str: A detailed string representation of the knowledge graph
        """
        return f"KnowledgeGraph(id={self.id}, nodes={len(self.graph.nodes)}, edges={len(self.graph.edges)})"
