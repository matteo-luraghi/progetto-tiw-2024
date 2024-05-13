package dao;

import java.sql.Connection;  
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;

import beans.Group;
import beans.User;

public class RelationshipsDAO {
	private Connection connection = null;
	
	public RelationshipsDAO(Connection connection) {
		this.connection = connection;
	}
	
	public void createGroup(Group group, ArrayList<User> participants, int creator_id) throws SQLException{
		this.connection.setAutoCommit(false);
		try {
			GroupDAO gDao = new GroupDAO(this.connection);
			int group_id = gDao.createGroup(group.getTitle(), group.getDate(), 
					group.getDuration(), group.getMinParticipants(), group.getMaxParticipants());
			this.setCreated(creator_id, group_id);
			for (User user: participants) {
				this.setContains(user.getId(), group_id);
			}
			// if success commit the result
			this.connection.commit();
		} catch(SQLException e) {
			// if errors rollback
			this.connection.rollback();
			this.connection.setAutoCommit(true);
			throw e;
		}
		this.connection.setAutoCommit(true);
	}
	
	private void setCreated(int user_id, int group_id) throws SQLException {
		String query = "INSERT INTO `created` (user_id, group_id) VALUES (?, ?)";
		
		try(PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1,	Integer.toString(user_id));
			pstatement.setString(2, Integer.toString(group_id));
			
			pstatement.executeUpdate();
		} 
	}
	
	private void setContains(int user_id, int group_id) throws SQLException {
		String query = "INSERT INTO `contains` (user_id, group_id) VALUES (?, ?)";
		
		try(PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1,	Integer.toString(user_id));
			pstatement.setString(2, Integer.toString(group_id));
			
			pstatement.executeUpdate();
		}
	}
	
	public void removeUser(int user_id, int group_id) throws SQLException {
		String query = "DELETE FROM `contains` WHERE user_id= ? AND group_id = ?";
		
		try(PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, Integer.toString(user_id));
			pstatement.setString(2, Integer.toString(group_id));
			
			pstatement.executeUpdate();
		}
	}

}