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
import java.text.ParseException;
import java.text.SimpleDateFormat;

import utils.ConnectionHandler;
import javax.servlet.ServletContext;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import beans.User;
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
		
		// TODO: get the list of selected users and check if everything is ok
				
		// if the session doesn't have an attribute "errors", the variable will remain 0
		int errors = 0;
		if (s.getAttribute("errors") != null) {
			errors = (int) s.getAttribute("errors");
		}
		
		// TODO: check conditions to save the group (min, max participants satisfied)
		if(true) { // save group details to database
			s.removeAttribute("errors");
			
			try {
				String title = request.getParameter("title");
				String sdate = request.getParameter("creation_date");
				int duration = Integer.parseInt(request.getParameter("duration"));
				int min_participants = Integer.parseInt(request.getParameter("min_participants"));
				int max_participants = Integer.parseInt(request.getParameter("max_participants"));
				
				// parse the string to get sql Date object
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");				
				java.util.Date date = sdf.parse(sdate);
				Date group_creation_date = new Date(date.getTime());
				
				GroupDAO g = new GroupDAO(connection);
				group_id = g.createGroup(title, group_creation_date, duration, min_participants, max_participants);
				
			} catch(SQLException | ParseException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in update of the database");
			}
			
			RelationshipsDAO rel = new RelationshipsDAO(connection);
			
			try {
				// save the group creator
				rel.setCreated(u.getId(), group_id);
				// save the group participants
				for(User user: participants) {
					rel.setContains(user.getId(), group_id);
				}	
			} catch (SQLException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in update of the database");
			}
			
			
			String path = getServletContext().getContextPath() + "/GoToHomepage";
			response.sendRedirect(path);
			
		} else if (errors == 3) { // redirect to the cancellation page
			s.removeAttribute("errors");
			
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
			s.setAttribute("errors", errors);	
			// TODO: show an error message and redirect to the same page with the correct users selected
			String path = "WEB-INF/RegisteredUsers.html";
			ServletContext servletContext = getServletContext();
			final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
			ctx.setVariable("createdGroups", selectedUsers);
			templateEngine.process(path, ctx, response.getWriter());
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
