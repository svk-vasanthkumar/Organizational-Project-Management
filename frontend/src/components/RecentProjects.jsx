function RecentProjects({ projects }) {

    return (

        <div className="card shadow-sm">

            <div className="card-body">

                <h5>Recent Projects</h5>

                <ul className="list-group">

                    {

                        projects.map(project=>(

                            <li
                            key={project._id}
                            className="list-group-item"
                            >

                                {project.name}

                            </li>

                        ))

                    }

                </ul>

            </div>

        </div>

    );

}

export default RecentProjects;