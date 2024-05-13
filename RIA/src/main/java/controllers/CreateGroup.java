package controllers;

import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringEscapeUtils;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import utils.ConnectionHandler;
import dao.RelationshipsDAO;
import dao.UserDAO;
import beans.Group;
import beans.User;

@WebServlet("/CreateGroup")
public class CreateGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public CreateGroup() {
        super();
    }
    
    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String loginpath = getServletContext().getContextPath() + "/index.html";
		User u = null;
		HttpSession s = request.getSession();
		if (s.isNew() || s.getAttribute("user") == null) {
			response.sendRedirect(loginpath);
			return;
		} else {
			u = (User) s.getAttribute("user");
		}

		String title = null;
		Integer duration = null;
		Integer min_participants = null;
		Integer max_participants = null;
		String[] users = null; 
		
		try {
			title = StringEscapeUtils.escapeJava(request.getParameter("title"));
			duration = Integer.parseInt(request.getParameter("duration"));
			max_participants = Integer.parseInt(request.getParameter("max_participants"));
			min_participants = Integer.parseInt(request.getParameter("min_participants"));
			users = request.getParameter("selected").split(","); 
			
			if(title == null || duration == null || min_participants == null || max_participants == null || users == null ||
					title.isEmpty() || title.length() > 100 || duration <= 0 || min_participants <= 0 || max_participants <= 0
					|| min_participants > max_participants) {
				throw new Exception("Incorrect or missing param values");
			}
			
		} catch(Exception e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect or missing param values");
			return;
		}
		
		
		if (users.length < min_participants || users.length > max_participants) { 
			//TODO error handling
		}

		UserDAO uDao = new UserDAO(connection);
		ArrayList<User> selectedUsers = new ArrayList<>();

		try {
			for(String userId: users) {
				try {
					selectedUsers.add(uDao.getUser(Integer.parseInt(userId)));
				} catch (NumberFormatException e) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().println("Invalid parameters");
					return;
				}
			}	
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Failure in database extraction");
			return;
		}
		
		LocalDate today = LocalDate.now();	
		Date creation_date = Date.valueOf(today); 
		
		Group group = new Group(-1, title, creation_date, duration, min_participants, max_participants);
		
		RelationshipsDAO rel = new RelationshipsDAO(this.connection);

		try {
			rel.createGroup(group, selectedUsers, u.getId());
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to create the group");
			return;
		}
		response.setStatus(HttpServletResponse.SC_OK);
		
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
