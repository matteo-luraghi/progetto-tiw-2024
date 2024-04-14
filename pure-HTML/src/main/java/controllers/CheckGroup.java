package controllers;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;

import utils.ConnectionHandler;
import javax.servlet.ServletContext;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;
import java.util.ArrayList;

import beans.User;
import dao.UserDAO;
import dao.GroupDAO;
import dao.RelationshipsDAO;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;

/**
 * Servlet implementation class CheckGroup
 */
@WebServlet("/CheckGroup")
public class CheckGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;

    public CheckGroup() {
        super();
    }

    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
		ServletContext servletContext = getServletContext();
		ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(servletContext);
		templateResolver.setTemplateMode(TemplateMode.HTML);
		this.templateEngine = new TemplateEngine();
		this.templateEngine.setTemplateResolver(templateResolver);
		templateResolver.setSuffix(".html");
	}
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String loginpath = getServletContext().getContextPath();
		User u = null;
		int group_id = -1;
		HttpSession s = request.getSession();
		if (s.isNew() || s.getAttribute("user") == null) {
			response.sendRedirect(loginpath);
			return;
		} else {
			u = (User) s.getAttribute("user");
		}
		
		int min_participants = (int) s.getAttribute("min_participants");
		int max_participants = (int) s.getAttribute("max_participants");
		
		UserDAO uDao = new UserDAO(connection);
		// Hypothesis : I get the users IDs
		String[] users = request.getParameterValues("selected"); 
		
		ArrayList<User> selectedUsers = new ArrayList<>();
		try {
			for(String userId: users) {
				selectedUsers.add(uDao.getUser(Integer.parseInt(userId)));
			}	
		} catch (SQLException e) {
			response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
		}
		
		String error_message = "";
		boolean highlighted = false;
				
		// if the session doesn't have an attribute "errors", the variable will remain 0
		int errors = 0;
		if (s.getAttribute("errors") != null) {
			errors = (int) s.getAttribute("errors");
		}
		
		if(users.length <= max_participants && users.length >= min_participants) { // save group details to database
			s.removeAttribute("errors");
			
			try {
				String title = (String) s.getAttribute("title");
				int duration = (int) s.getAttribute("duration");			
				
				LocalDate today = LocalDate.now();	
				Date creation_date = Date.valueOf(today); 
				
				GroupDAO g = new GroupDAO(connection);
				group_id = g.createGroup(title, creation_date, duration, min_participants, max_participants);
				
			} catch(SQLException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in update of the database");
			}
			
			RelationshipsDAO rel = new RelationshipsDAO(connection);
			
			try {
				// save the group creator
				rel.setCreated(u.getId(), group_id);
				// save the group participants
				for(User user: selectedUsers) {
					rel.setContains(user.getId(), group_id);
				}	
			} catch (SQLException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in update of the database");
			}		
			
			s.removeAttribute("title");
			s.removeAttribute("duration");
			s.removeAttribute("min_participants");
			s.removeAttribute("max_participants");
			
			String path = getServletContext().getContextPath() + "/GoToHomepage";
			response.sendRedirect(path);			
			return;
			
		} else if (users.length < min_participants) {
		
			error_message = "Troppi pochi utenti selezionati, aggiungerne almeno " + Integer.toString(min_participants - users.length);
		
		} else if (users.length > max_participants) {
			
			error_message = "Trppi utenti selezionati, eliminarne almeno " + Integer.toString(users.length - max_participants);
			highlighted = true;
		
		} 
		
		if (errors == 3) { // redirect to the cancellation page
			s.removeAttribute("errors");
			s.removeAttribute("title");
			s.removeAttribute("duration");
			s.removeAttribute("min_participants");
			s.removeAttribute("max_participants");
			
			String path = getServletContext().getContextPath() + "WEB-INF/Cancel.html";
			response.sendRedirect(path);
			
		} else  {
			if (errors == 0) {
				// set to 1 the error counter
				errors = 1;
			}
			else {
				// add 1 to the error counter
				errors += 1;
			}
			
			ArrayList<User> registeredUsers = null;
			try {
				registeredUsers = uDao.getRegisteredUsers();
			} catch(SQLException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
			}
			
			if (registeredUsers != null && selectedUsers != null) {
				// remove self from the invite list
				registeredUsers.remove(u);
				s.setAttribute("errors", errors);	
				String path = "WEB-INF/RegisteredUsers.html";
				ServletContext servletContext = getServletContext();
				final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
				ctx.setVariable("registeredUsers", registeredUsers);
				ctx.setVariable("selectedUsers", selectedUsers);
				ctx.setVariable("highlighted", highlighted);
				ctx.setVariable("error_message", error_message);	
				templateEngine.process(path, ctx, response.getWriter());	
			} else {
				String path = getServletContext().getContextPath() + "/GoToHomepage";
				response.sendRedirect(path);
			}	
		}
		
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
